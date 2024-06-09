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

    const commentData = { email, comment };

    fetch('/addComment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayComment(commentData);
            document.getElementById('Email').value = '';
            document.getElementById('comment').value = '';
        } else {
            alert('Error adding comment.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function loadComments() {
    fetch('/comments')
        .then(response => response.json())
        .then(data => {
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
