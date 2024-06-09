document.addEventListener('DOMContentLoaded', () => {
    loadComments();
});

function addComment() {
    const email = document.getElementById('Email').value;
    const comment = document.getElementById('comment').value;

    if (!email || !comment) {
        alert('Please fill in both fields.');
        return;
    }

    if (!validateEmail(email)) {
        alert('Please enter a valid USP email address.');
        return;
    }

    const username = email.split('@')[0];
    const commentData = { email: username, comment };

    console.log('Sending comment data:', commentData); // Debugging line

    fetch('/addComment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server response:', data); // Debugging line
        if (data.success) {
            displayComment(commentData);
            document.getElementById('Email').value = '';
            document.getElementById('comment').value = '';
        } else {
            alert('Error adding comment: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error adding comment: ' + error.message);
    });
}

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@usp\.br$/i;
    return emailRegex.test(email);
}

function loadComments() {
    fetch('/comments')
        .then(response => response.json())
        .then(data => {
            console.log('Loaded comments:', data); // Debugging line
            data.forEach(comment => displayComment(comment));
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayComment(commentData) {
    const commentsDiv = document.getElementById('comments');
    const commentElement = document.createElement('div');
    commentElement.innerHTML = `<p><strong>${commentData.email}</strong>: ${commentData.comment}</p>`;
    commentsDiv.appendChild(commentElement);
}
