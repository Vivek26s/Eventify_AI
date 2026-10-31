import { jsPDF } from 'jspdf';
import { EventData, ExpenseItem, TaskItem, VendorItem } from '../types';

export function exportEventPlanToPDF(
  event: EventData,
  expenses: ExpenseItem[] = [],
  tasks: TaskItem[] = [],
  vendors: VendorItem[] = []
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  const addHeader = () => {
    // Brand header banner
    doc.setFillColor(124, 58, 237); // #7C3AED
    doc.rect(0, 0, pageWidth, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('EVENTIFY AI  |  SMART CELEBRATION & EVENT MASTER PLAN', 15, 10);
  };

  addHeader();

  // Title
  y = 28;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(event.name, 15, y);

  y += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Category: ${event.category}   |   Date: ${event.date}   |   Location: ${event.location}`,
    15,
    y
  );

  y += 5;
  doc.text(
    `Expected Guests: ${event.guestCount}   |   Budget: ${event.currency} ${event.totalBudget.toLocaleString()}   |   Theme: ${event.themePreference}`,
    15,
    y
  );

  // Line separator
  y += 6;
  doc.setDrawColor(226, 232, 240);
  doc.line(15, y, pageWidth - 15, y);

  // 1. Event Overview
  if (event.aiPlan?.eventOverview) {
    y += 10;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(124, 58, 237);
    doc.text('1. Event Executive Summary & Concept', 15, y);

    y += 6;
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const splitSummary = doc.splitTextToSize(event.aiPlan.eventOverview.summary, pageWidth - 30);
    doc.text(splitSummary, 15, y);
    y += splitSummary.length * 5;

    doc.setFont('helvetica', 'bold');
    doc.text(`Target Vibe: `, 15, y);
    doc.setFont('helvetica', 'normal');
    doc.text(event.aiPlan.eventOverview.targetVibe, 40, y);

    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.text(`Key Highlight: `, 15, y);
    doc.setFont('helvetica', 'normal');
    const splitHighlight = doc.splitTextToSize(event.aiPlan.eventOverview.keyHighlight, pageWidth - 45);
    doc.text(splitHighlight, 42, y);
    y += splitHighlight.length * 5 + 3;
  }

  // 2. Budget Allocation
  if (event.aiPlan?.budget && event.aiPlan.budget.length > 0) {
    if (y > 240) {
      doc.addPage();
      addHeader();
      y = 25;
    }

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(124, 58, 237);
    doc.text('2. Budget Allocation (Strict Limit Enforced)', 15, y);
    y += 6;

    doc.setFontSize(9);
    doc.setFillColor(241, 245, 249);
    doc.rect(15, y - 4, pageWidth - 30, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Category', 18, y);
    doc.text('Share', 75, y);
    doc.text(`Amount (${event.currency})`, 95, y);
    doc.text('Notes / Strategy', 135, y);

    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    event.aiPlan.budget.forEach((item) => {
      if (y > 270) {
        doc.addPage();
        addHeader();
        y = 25;
      }
      doc.text(item.category, 18, y);
      doc.text(`${item.percentage}%`, 75, y);
      doc.text(`${item.allocatedAmount.toLocaleString()}`, 95, y);
      const splitNotes = doc.splitTextToSize(item.notes, pageWidth - 150);
      doc.text(splitNotes[0] || '', 135, y);
      y += 6;
    });
    y += 4;
  }

  // 3. Preparation Timeline
  if (event.aiPlan?.timeline && event.aiPlan.timeline.length > 0) {
    if (y > 230) {
      doc.addPage();
      addHeader();
      y = 25;
    }

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(124, 58, 237);
    doc.text('3. Preparation Timeline Milestones', 15, y);
    y += 6;

    event.aiPlan.timeline.forEach((tl) => {
      if (y > 270) {
        doc.addPage();
        addHeader();
        y = 25;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(236, 72, 153); // Pink
      doc.text(`• ${tl.timeframe}: ${tl.title}`, 18, y);
      y += 4.5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const splitDesc = doc.splitTextToSize(tl.description, pageWidth - 36);
      doc.text(splitDesc, 22, y);
      y += splitDesc.length * 4.5 + 2;
    });
    y += 4;
  }

  // 4. Food & Catering Suggestions
  if (event.aiPlan?.foodSuggestions && event.aiPlan.foodSuggestions.length > 0) {
    if (y > 240) {
      doc.addPage();
      addHeader();
      y = 25;
    }

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(124, 58, 237);
    doc.text('4. Recommended Menu & Food Suggestions', 15, y);
    y += 6;

    event.aiPlan.foodSuggestions.forEach((f) => {
      if (y > 270) {
        doc.addPage();
        addHeader();
        y = 25;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text(`[${f.mealType}] ${f.name} ${f.isVeg ? '(Veg)' : '(Non-Veg)'}`, 18, y);
      y += 4;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const splitFood = doc.splitTextToSize(f.description, pageWidth - 36);
      doc.text(splitFood, 22, y);
      y += splitFood.length * 4.5 + 2;
    });
    y += 4;
  }

  // 5. Vendor Checklist
  if (event.aiPlan?.vendorsChecklist && event.aiPlan.vendorsChecklist.length > 0) {
    if (y > 240) {
      doc.addPage();
      addHeader();
      y = 25;
    }

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(124, 58, 237);
    doc.text('5. Vendor Checklist & Critical Questions', 15, y);
    y += 6;

    event.aiPlan.vendorsChecklist.forEach((v) => {
      if (y > 265) {
        doc.addPage();
        addHeader();
        y = 25;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text(`${v.category}: ${v.role} (Est. ${event.currency} ${v.estimatedCost.toLocaleString()})`, 18, y);
      y += 4;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const qs = v.essentialQuestions.map((q) => `  - ${q}`).join('\n');
      const splitQs = doc.splitTextToSize(qs, pageWidth - 36);
      doc.text(splitQs, 22, y);
      y += splitQs.length * 4 + 3;
    });
    y += 4;
  }

  // 6. Tips & Reminders
  if (event.aiPlan?.tips && event.aiPlan.tips.length > 0) {
    if (y > 240) {
      doc.addPage();
      addHeader();
      y = 25;
    }

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(124, 58, 237);
    doc.text('6. Pro Tips & Host Reminders', 15, y);
    y += 6;

    event.aiPlan.tips.forEach((tip) => {
      if (y > 270) {
        doc.addPage();
        addHeader();
        y = 25;
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const splitTip = doc.splitTextToSize(`✓ ${tip}`, pageWidth - 36);
      doc.text(splitTip, 18, y);
      y += splitTip.length * 4.5 + 2;
    });
  }

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated by Eventify AI • Powered by Google Gemini • Page ${i} of ${totalPages}`, pageWidth / 2, 290, {
      align: 'center',
    });
  }

  const safeFilename = `${event.name.replace(/[^a-zA-Z0-9]/g, '_')}_Master_Plan.pdf`;
  doc.save(safeFilename);
}
