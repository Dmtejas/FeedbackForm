document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedbackForm');

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Stop form from submitting

    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    let isValid = true;

    // Helper function to show error
    const showError = (input, message) => {
      const error = document.createElement('div');
      error.className = 'error-message';
      error.style.color = 'red';
      error.style.marginTop = '5px';
      error.textContent = message;
      input.parentNode.appendChild(error);
      isValid = false;
    };

    // Get form field values
    const studentName = document.getElementById('studentName');
    const email = document.getElementById('email');
    const teacherName = document.getElementById('teacherName');
    const subject = document.getElementById('subject');
    const otherSubject = document.getElementById('otherSubject');
    const clarity = document.getElementById('clarity');
    const engagement = document.getElementById('engagement');
    const comments = document.getElementById('comments');

    // Validations
    if (studentName.value.trim() === '') {
      showError(studentName, 'Please enter your name.');
    }

    if (email.value.trim() === '') {
      showError(email, 'Please enter your email.');
    } else if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) {
      showError(email, 'Please enter a valid email address.');
    }

    if (teacherName.value.trim() === '') {
      showError(teacherName, "Please enter the teacher's name.");
    }

    if (subject.value === '') {
      showError(subject, 'Please select a subject.');
    }

    if (subject.value === 'other' && otherSubject.value.trim() === '') {
      showError(otherSubject, 'Please enter the other subject name.');
    }

    if (clarity.value === '') {
      showError(clarity, 'Please select clarity of explanation.');
    }

    if (engagement.value === '') {
      showError(engagement, 'Please select student engagement.');
    }

    if (comments.value.trim().length < 10) {
      showError(comments, 'Please provide more detailed feedback (at least 10 characters).');
    }

    // Final check
    if (isValid) {
      // Prepare form data as a plain object
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

      // Submit the data to the server using fetch
      fetch('http://localhost:3000/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Feedback submitted successfully!') {
          alert(data.message);
          form.reset();
          document.getElementById('otherSubjectGroup').style.display = 'none';
        } else {
          alert('Failed to submit feedback. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error submitting feedback. Please try again later.');
      });
    } else {
      // Scroll to the first error smoothly
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
});
