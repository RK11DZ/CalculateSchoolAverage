let subjects = [];
let semester = '';
const semesterData = {};

const semesterSelect = document.getElementById('semester');

// إضافة مستمع لحدث إغلاق الصفحة
window.addEventListener('beforeunload', function(e) {
    if (subjects.length > 0 || Object.keys(semesterData).length > 0) {
        e.preventDefault();
        e.returnValue = 'هل تريد حفظ البيانات قبل المغادرة؟';
        return e.returnValue;
    }
});

semesterSelect.addEventListener('change', function() {
    if (semester) {
        semesterData[semester] = [...subjects];
    }
    
    semester = this.value;
    this.style.borderColor = '';
    subjects = semesterData[semester] || [];
    
    updateSubjectsList();
    calculateAverage();
    updateChart();

    if (semester === '3') {
        calculateAnnualAverage();
        document.getElementById('annual-average-container').style.display = 'block';
        document.getElementById('grade-evaluation').style.display = 'none';
    } else {
        document.getElementById('annual-average-container').style.display = 'none';
        document.getElementById('grade-evaluation').style.display = 'block';
    }
});

function updateSubjectsList() {
    const subjectsList = document.getElementById('subjects');
    subjectsList.innerHTML = '';

    subjects.forEach((subject, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${subject.name}: ${subject.finalGrade} (معامل: ${subject.coefficient})
            <div class="subject-actions">
                <button onclick="editSubject(${index})" class="edit-btn">تعديل</button>
                <button onclick="deleteSubject(${index})" class="delete-btn">حذف</button>
            </div>
        `;
        subjectsList.appendChild(li);
    });
}

function deleteSubject(index) {
    if (confirm('هل أنت متأكد من حذف هذه المادة؟')) {
        subjects.splice(index, 1);
        updateSubjectsList();
        calculateAverage();
        updateChart();
    }
}

function editSubject(index) {
    const subject = subjects[index];
    
    document.getElementById('subject').value = subject.name;
    document.getElementById('coefficient').value = subject.coefficient;
    
    const finalGrade = parseFloat(subject.finalGrade);
    const assignment1 = finalGrade;
    const exam1 = finalGrade;
    const finalExam = finalGrade;
    
    document.getElementById('assignment1').value = assignment1;
    document.getElementById('exam1').value = exam1;
    document.getElementById('finalExam').value = finalExam;
    
    subjects.splice(index, 1);
    
    updateSubjectsList();
    calculateAverage();
    updateChart();
}

function calculateAverage() {
    let totalGrade = 0;
    let totalCoefficient = 0;
    subjects.forEach((subject) => {
        totalGrade += parseFloat(subject.finalGrade) * subject.coefficient;
        totalCoefficient += subject.coefficient;
    });
    const semesterAverage = totalCoefficient ? (totalGrade / totalCoefficient).toFixed(2) : '0.00';
    document.getElementById('semester-average').textContent = semesterAverage;
    document.getElementById('evaluation').textContent = getGradeEvaluation(semesterAverage);
    
    showCongratulations(parseFloat(semesterAverage));
}

function getGradeEvaluation(average) {
    if (average >= 18) return "ممتاز";
    else if (average >= 15) return "جيد جدًا";
    else if (average >= 12) return "جيد";
    else if (average >= 10) return "مقبول";
    else return "ضعيف";
}

function updateChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    const labels = subjects.map(sub => sub.name);
    const data = subjects.map(sub => parseFloat(sub.finalGrade));

    if (window.performanceChart instanceof Chart) {
        window.performanceChart.destroy();
    }

    window.performanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'العلامات',
                data: data,
                backgroundColor: 'rgba(98, 0, 238, 0.6)',
                borderColor: 'rgba(98, 0, 238, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 20
                }
            }
        }
    });
}

function addSubject() {
    if (!semester) {
        alert('يرجى اختيار الفصل الدراسي أولاً.');
        semesterSelect.style.borderColor = 'red';
        return;
    }

    const subjectSelect = document.getElementById('subject');
    if (!subjectSelect.value) {
        alert('يرجى اختيار المادة أولاً');
        subjectSelect.style.borderColor = 'red';
        return;
    }

    const subjectName = subjectSelect.value;
    const coefficientInput = document.getElementById('coefficient');
    const assignment1Input = document.getElementById('assignment1');
    const exam1Input = document.getElementById('exam1');
    const finalExamInput = document.getElementById('finalExam');

    if (!coefficientInput.value || !assignment1Input.value || !exam1Input.value || !finalExamInput.value) {
        alert('يرجى إدخال جميع القيم المطلوبة');
        return;
    }

    const assignment1 = parseFloat(assignment1Input.value) || 0;
    const exam1 = parseFloat(exam1Input.value) || 0;
    const finalExam = parseFloat(finalExamInput.value) || 0;
    const coefficient = parseInt(coefficientInput.value, 10);

    let inputError = false;

    if (isNaN(coefficient) || coefficient < 1 || coefficient > 5) {
        coefficientInput.style.borderColor = 'red';
        alert('يرجى إدخال معامل صحيح بين 1 و 5.');
        inputError = true;
    } else {
        coefficientInput.style.borderColor = '';
    }

    if (assignment1 < 0 || assignment1 > 20) {
        assignment1Input.style.borderColor = 'red';
        alert('يرجى إدخال علامة الفرض بين 0 و 20.');
        inputError = true;
    } else {
        assignment1Input.style.borderColor = '';
    }

    if (exam1 < 0 || exam1 > 20) {
        exam1Input.style.borderColor = 'red';
        alert('يرجى إدخال علامة التقويم بين 0 و 20.');
        inputError = true;
    } else {
        exam1Input.style.borderColor = '';
    }

    if (finalExam < 0 || finalExam > 20) {
        finalExamInput.style.borderColor = 'red';
        alert('يرجى إدخال علامة الاختبار النهائي بين 0 و 20.');
        inputError = true;
    } else {
        finalExamInput.style.borderColor = '';
    }

    if (inputError) return;

    const existingSubject = subjects.find(subject => subject.name === subjectName);
    if (existingSubject) {
        alert('لقد قمت بإضافة هذه المادة بالفعل. يرجى اختيار مادة أخرى.');
        return;
    }

    const finalGrade = ((assignment1 * 2) + (exam1 * 1) + (finalExam * 2)) / 5;
    subjects.push({ name: subjectName, coefficient: coefficient, finalGrade: finalGrade.toFixed(2) });

    coefficientInput.value = '';
    subjectSelect.value = '';
    assignment1Input.value = '';
    exam1Input.value = '';
    finalExamInput.value = '';

    updateSubjectsList();
    calculateAverage();
    updateChart();
}

function calculateAnnualAverage() {
    let totalAverage = 0;
    let count = 0;

    for (let i = 1; i <= 3; i++) {
        const semesterSubjects = semesterData[i];
        if (semesterSubjects) {
            const semesterTotal = semesterSubjects.reduce((sum, subject) => sum + parseFloat(subject.finalGrade) * subject.coefficient, 0);
            const totalCoefficients = semesterSubjects.reduce((sum, subject) => sum + subject.coefficient, 0);
            const semesterAverage = totalCoefficients ? (semesterTotal / totalCoefficients) : 0;
            totalAverage += semesterAverage;
            count++;
        }
    }

    const annualAverage = count ? (totalAverage / count).toFixed(2) : '0.00';
    document.getElementById('annual-average').textContent = annualAverage;
}

function saveData() {
    const data = {
        subjects: subjects,
        semester: semester,
        semesterData: semesterData
    };
    localStorage.setItem('gradeCalculatorData', JSON.stringify(data));
    alert('تم حفظ البيانات بنجاح!');
}

function loadSavedData() {
    const savedData = localStorage.getItem('gradeCalculatorData');
    if (savedData) {
        const data = JSON.parse(savedData);
        subjects = data.subjects;
        semester = data.semester;
        Object.assign(semesterData, data.semesterData);
        
        if (semester) {
            document.getElementById('semester').value = semester;
        }
        
        updateSubjectsList();
        calculateAverage();
        updateChart();
    }
}

function showCongratulations(average) {
    const congratsDiv = document.getElementById('congratulations-message');
    if (average >= 15) {
        congratsDiv.textContent = 'تهانينا! أداء ممتاز، استمر في العمل الجيد! 🎉';
        congratsDiv.style.display = 'block';
    } else {
        congratsDiv.style.display = 'none';
    }
}

function compareResults() {
    const comparisonDiv = document.getElementById('comparison-chart');
    comparisonDiv.style.display = 'block';
    
    if (window.comparisonChart instanceof Chart) {
        window.comparisonChart.destroy();
    }
    
    const semesters = Object.keys(semesterData).sort();
    if (semesters.length === 0) {
        alert('لا توجد بيانات للمقارنة. الرجاء إضافة درجات لفصل دراسي واحد على الأقل.');
        return;
    }
    
    const averages = semesters.map(sem => {
        const semSubjects = semesterData[sem];
        if (!semSubjects || semSubjects.length === 0) return 0;
        
        const total = semSubjects.reduce((sum, subject) => 
            sum + parseFloat(subject.finalGrade) * subject.coefficient, 0);
        const coeffSum = semSubjects.reduce((sum, subject) => 
            sum + subject.coefficient, 0);
        
        return coeffSum ? (total / coeffSum) : 0;
    });
    
    const ctx = document.getElementById('comparisonChart').getContext('2d');
    window.comparisonChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: semesters.map(sem => `الفصل ${sem}`),
            datasets: [{
                label: 'المعدل الفصلي',
                data: averages,
                borderColor: '#bb86fc',
                backgroundColor: 'rgba(187, 134, 252, 0.2)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#bb86fc',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#bb86fc',
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#e0e0e0'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(43, 43, 43, 0.9)',
                    titleColor: '#bb86fc',
                    bodyColor: '#fff',
                    borderColor: '#bb86fc',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `المعدل: ${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 20,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#e0e0e0'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#e0e0e0'
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', loadSavedData);