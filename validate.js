document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedbackForm');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    let isValid = true;

    const showError = (input, message) => {
      const error = document.createElement('div');
      error.className = 'error-message';
      error.style.color = 'red';
      error.textContent = message;
      input.parentNode.appendChild(error);
      isValid = false;
    };

    const studentName = document.getElementById('studentName');
    const email = document.getElementById('email');
    const teacherName = document.getElementById('teacherName');
    const subject = document.getElementById('subject');
    const otherSubject = document.getElementById('otherSubject');
    const clarity = document.getElementById('clarity');
    const engagement = document.getElementById('engagement');
    const comments = document.getElementById('comments');

    if (studentName.value.trim() === '') showError(studentName, 'Please enter your name.');
    if (email.value.trim() === '') showError(email, 'Please enter your email.');
    else if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) showError(email, 'Invalid email.');
    if (teacherName.value.trim() === '') showError(teacherName, 'Enter teacher name.');
    if (subject.value === '') showError(subject, 'Select subject.');
    if (subject.value === 'other' && otherSubject.value.trim() === '') showError(otherSubject, 'Enter other subject.');
    if (clarity.value === '') showError(clarity, 'Select clarity.');
    if (engagement.value === '') showError(engagement, 'Select engagement.');
    if (comments.value.trim().length < 10) showError(comments, 'Min 10 characters.');

    if (isValid) {
      const feedbackData = {
        studentName: studentName.value.trim(),
        email: email.value.trim(),
        teacherName: teacherName.value.trim(),
        subject: subject.value,
        otherSubject: subject.value === 'other' ? otherSubject.value.trim() : '',
        clarity: clarity.value,
        engagement: engagement.value,
        comments: comments.value.trim(),
      };

      fetch('/submit-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData),
      })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        form.reset();
        document.getElementById('otherSubjectGroup').style.display = 'none';
      })
      .catch(err => {
        console.error(err);
        alert('Server error. Try again later.');
      });
    }
  });

  const subjectDropdown = document.getElementById('subject');
  const otherSubjectGroup = document.getElementById('otherSubjectGroup');

  subjectDropdown.addEventListener('change', function () {
    otherSubjectGroup.style.display = this.value === 'other' ? 'block' : 'none';
  });
});
