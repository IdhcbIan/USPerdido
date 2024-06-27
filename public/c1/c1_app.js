document.addEventListener('DOMContentLoaded', function () {
  fetch('/c1/db/c1_posts.json')
    .then(response => response.json())
    .then(posts => {
      const feed = document.getElementById('feed');
      posts.forEach((post, index) => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = `
          <div class="post_content">
            <h2 class="post_title">${post.title}</h2>
            <p class="post_body">${post.content}</p>
            ${post.image ? `<img src="db/im/${post.image}" class="post_img" alt="${post.title}">` : ''}
          </div>
          <div class="comments_section">
            <h3>Comments</h3>
            <div id="comments_${index}" class="comments"></div>
            <div class="div_input">
              <input type="email" placeholder="Email USP" id="email_${index}">
              <input type="text" placeholder="Comentário" id="comment_${index}">
              <button onclick="addComment(${index})">Adicionar</button>
            </div>
          </div>
        `;
        feed.appendChild(postDiv);

        post.comments.forEach(comment => {
          const email = comment.email.split('@')[0]; // Truncate the email
          const commentP = document.createElement('p');
          commentP.textContent = `${email}: ${comment.comment}`;
          document.getElementById(`comments_${index}`).appendChild(commentP);
        });
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

function addComment(postId) {
  const email = document.getElementById(`email_${postId}`).value;
  const comment = document.getElementById(`comment_${postId}`).value;

  fetch('/add-comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ postId, email, comment }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        location.reload();  // Reload to show the new comment
      } else {
        alert('Failed to add comment');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
