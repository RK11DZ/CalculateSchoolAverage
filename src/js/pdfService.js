// وظائف إنشاء وتصدير ملفات PDF
function createPdfDefinition(subjects, average) {
    const tableBody = subjects.map(subject => [
        { text: subject.grade.toString(), alignment: 'center' },
        { text: subject.coefficient.toString(), alignment: 'center' },
        { text: subject.name, alignment: 'right' }
    ]);

    // إضافة رأس الجدول
    tableBody.unshift([
        { text: 'العلامة', alignment: 'center', bold: true },
        { text: 'المعامل', alignment: 'center', bold: true },
        { text: 'المادة', alignment: 'right', bold: true }
    ]);

    return {
        defaultStyle: {
            font: 'Amiri',
            direction: 'rtl'
        },
        content: [
            { text: 'كشف النقاط', style: 'header' },
            { text: `المعدل الفصلي: ${average.toFixed(2)}`, style: 'subheader' },
            {
                table: {
                    headerRows: 1,
                    widths: ['25%', '25%', '50%'],
                    body: tableBody
                }
            }
        ],
        styles: {
            header: {
                fontSize: 22,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 20]
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 0, 0, 20]
            }
        }
    };
}

function exportToPDF(subjects, average) {
    try {
        const docDefinition = createPdfDefinition(subjects, average);
        pdfMake.createPdf(docDefinition).download('كشف_النقاط.pdf');
    } catch (error) {
        console.error('خطأ في إنشاء PDF:', error);
        alert('حدث خطأ أثناء إنشاء ملف PDF');
    }
}

// تصدير الوظائف
window.pdfService = {
    exportToPDF
};
