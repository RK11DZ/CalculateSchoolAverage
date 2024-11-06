let subjects = [];
let semester = '';
const grades = [90, 80, 85]; // درجات المواد
const weights = [3, 2, 1]; // أوزان المواد

let weightedSum = 0;
let totalWeights = 0;

// لا حاجة لحساب المعدل السنوي هنا

// تحديث قائمة المواد على واجهة المستخدم
function updateSubjectsList() {
    const subjectsList = document.getElementById('subjects');
    subjectsList.innerHTML = '';

    subjects.forEach((subject) => {
        const li = document.createElement('li');
        li.textContent = `${subject.name}: ${subject.grade} (معامل: ${subject.coefficient})`;
        subjectsList.appendChild(li);
    });
}

// حساب المعدل الفصلي
function calculateAverage() {
    let totalGrade = 0;
    let totalCoefficient = 0;
    subjects.forEach((subject) => {
        totalGrade += subject.grade * subject.coefficient;
        totalCoefficient += subject.coefficient;
    });
    const semesterAverage = totalCoefficient ? (totalGrade / totalCoefficient).toFixed(2) : '0.00';
    document.getElementById('semester-average').textContent = semesterAverage;
}

// تحديث الرسم البياني
function updateChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    const labels = subjects.map(sub => sub.name);
    const data = subjects.map(sub => sub.grade);

    // التأكد من أن `performanceChart` هو كائن من نوع Chart قبل استدعاء `destroy`
    if (window.performanceChart instanceof Chart) {
        window.performanceChart.destroy();
    }

    // إنشاء مخطط جديد وتخزينه في `window.performanceChart`
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

// إضافة مادة
function addSubject() {
    if (!semester) {
        alert('يرجى اختيار الفصل الدراسي أولاً.');
        return;
    }

    const subjectName = document.getElementById('subject').value;
    const gradeInput = document.getElementById('grade');
    const coefficientInput = document.getElementById('coefficient');

    const grade = parseFloat(gradeInput.value);
    const coefficient = parseInt(coefficientInput.value, 10);

    // التحقق من إدخال صحيح للعلامة والمعامل
    if (isNaN(grade) || grade < 0 || grade > 20) {
        gradeInput.classList.add('invalid');
        alert('يرجى إدخال علامة صحيحة بين 0 و 20.');
        return;
    } else {
        gradeInput.classList.remove('invalid');
    }

    if (isNaN(coefficient) || coefficient < 1 || coefficient > 5) {
        coefficientInput.classList.add('invalid');
        alert('يرجى إدخال معامل صحيح بين 1 و 5.');
        return;
    } else {
        coefficientInput.classList.remove('invalid');
    }

    // التحقق من عدم تكرار المادة
    const existingSubject = subjects.find(subject => subject.name === subjectName);
    if (existingSubject) {
        alert('لقد قمت بإضافة هذه المادة بالفعل. يرجى اختيار مادة أخرى.');
        return;
    }

    // إضافة المادة إلى القائمة
    subjects.push({ name: subjectName, grade: grade, coefficient: coefficient });
    gradeInput.value = '';
    coefficientInput.value = '';
    document.getElementById('subject').value = '';

    updateSubjectsList();
    calculateAverage(); // ما زلنا نحافظ على حساب المعدل الفصلي
    updateChart();
}

// التحكم في اختيار الفصل الدراسي
document.getElementById('semester').addEventListener('change', function() {
    semester = this.value;
    subjects = []; // إعادة تعيين المواد عند تغيير الفصل
    updateSubjectsList();
    calculateAverage(); // حساب المعدل الفصلي بعد تغيير الفصل
    updateChart();
});

