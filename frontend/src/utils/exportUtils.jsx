import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToPDF = (campaign) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Campaign Report', 20, 20);
  
  // Campaign Info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Type: ${campaign.campaign_type}`, 20, 35);
  doc.text(`Category: ${campaign.category} - ${campaign.subcategory}`, 20, 42);
  doc.text(`Tone: ${campaign.tone}`, 20, 49);
  doc.text(`Created: ${new Date(campaign.created_at).toLocaleDateString()}`, 20, 56);
  
  // Product Description
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Product Description:', 20, 70);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const descLines = doc.splitTextToSize(campaign.product_description, 170);
  doc.text(descLines, 20, 78);
  
  let yPos = 78 + (descLines.length * 7) + 10;
  
  // Content
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Generated Content:', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const content = campaign.content;
  if (campaign.campaign_type === 'social_media') {
    doc.text('Instagram Caption:', 20, yPos);
    yPos += 7;
    const captionLines = doc.splitTextToSize(content.instagram_caption || '', 170);
    doc.text(captionLines, 25, yPos);
    yPos += (captionLines.length * 7) + 5;
    
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.text('Instagram Hashtags:', 20, yPos);
    yPos += 7;
    const hashtags = Array.isArray(content.instagram_hashtags) 
      ? content.instagram_hashtags.join(' ') 
      : content.instagram_hashtags || '';
    const hashtagLines = doc.splitTextToSize(hashtags, 170);
    doc.text(hashtagLines, 25, yPos);
    yPos += (hashtagLines.length * 7) + 5;
    
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.text('Facebook Post:', 20, yPos);
    yPos += 7;
    const fbLines = doc.splitTextToSize(content.facebook_post || '', 170);
    doc.text(fbLines, 25, yPos);
  } else if (campaign.campaign_type === 'email') {
    doc.text(`Subject: ${content.subject_line || ''}`, 20, yPos);
    yPos += 10;
    doc.text('Email Body:', 20, yPos);
    yPos += 7;
    const bodyLines = doc.splitTextToSize(content.email_body || '', 170);
    doc.text(bodyLines, 25, yPos);
    yPos += (bodyLines.length * 7) + 5;
    
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.text(`CTA: ${content.cta_text || ''}`, 20, yPos);
  } else if (campaign.campaign_type === 'meta_ads') {
    doc.text('Primary Text:', 20, yPos);
    yPos += 7;
    const primaryLines = doc.splitTextToSize(content.primary_text || '', 170);
    doc.text(primaryLines, 25, yPos);
    yPos += (primaryLines.length * 7) + 5;
    
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.text(`Headline: ${content.headline || ''}`, 20, yPos);
    yPos += 7;
    doc.text(`Description: ${content.description || ''}`, 20, yPos);
    yPos += 7;
    doc.text(`CTA: ${content.cta || ''}`, 20, yPos);
    yPos += 7;
    doc.text(`Target Audience: ${content.target_audience || ''}`, 20, yPos);
  }
  
  // Poster Design
  if (campaign.poster_design) {
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }
    
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Poster Design:', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Title: ${campaign.poster_design.title || ''}`, 20, yPos);
    yPos += 7;
    doc.text(`Subtitle: ${campaign.poster_design.subtitle || ''}`, 20, yPos);
    yPos += 7;
    const mainTextLines = doc.splitTextToSize(campaign.poster_design.main_text || '', 170);
    doc.text('Main Text:', 20, yPos);
    yPos += 7;
    doc.text(mainTextLines, 25, yPos);
    yPos += (mainTextLines.length * 7) + 5;
    doc.text(`Color Scheme: ${campaign.poster_design.color_scheme || ''}`, 20, yPos);
  }
  
  // Save
  doc.save(`campaign-${campaign.id}.pdf`);
};

export const exportToJSON = (campaign) => {
  const dataStr = JSON.stringify(campaign, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `campaign-${campaign.id}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToCSV = (campaign) => {
  const headers = ['Field', 'Value'];
  const rows = [
    ['Campaign ID', campaign.id],
    ['Type', campaign.campaign_type],
    ['Category', campaign.category],
    ['Subcategory', campaign.subcategory],
    ['Tone', campaign.tone],
    ['Product Description', `"${campaign.product_description.replace(/"/g, '""')}"`],
    ['Created Date', new Date(campaign.created_at).toLocaleDateString()],
  ];
  
  // Add content fields
  const content = campaign.content;
  Object.entries(content).forEach(([key, value]) => {
    if (typeof value === 'string') {
      rows.push([key, `"${value.replace(/"/g, '""')}"`]);
    } else if (Array.isArray(value)) {
      rows.push([key, `"${value.join(', ').replace(/"/g, '""')}"`]);
    }
  });
  
  // Add poster design if exists
  if (campaign.poster_design) {
    Object.entries(campaign.poster_design).forEach(([key, value]) => {
      rows.push([`Poster ${key}`, `"${value.replace(/"/g, '""')}"`]);
    });
  }
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `campaign-${campaign.id}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportAllToJSON = (campaigns) => {
  const dataStr = JSON.stringify(campaigns, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `all-campaigns-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportAllToCSV = (campaigns) => {
  const headers = ['ID', 'Type', 'Category', 'Subcategory', 'Tone', 'Product Description', 'Created Date'];
  const rows = campaigns.map(campaign => [
    campaign.id,
    campaign.campaign_type,
    campaign.category,
    campaign.subcategory,
    campaign.tone,
    `"${campaign.product_description.replace(/"/g, '""')}"`,
    new Date(campaign.created_at).toLocaleDateString()
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `all-campaigns-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
