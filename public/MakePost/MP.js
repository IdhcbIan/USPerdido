document.getElementById('postForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const formData = new FormData(this);

  fetch('/create-post', {
    method: 'POST',
    body: formData
  })
    .then(response => response.text())
    .then(data => {
      alert(data);
      window.location.href = '../c1/c1.html';  // Redirect to the community page
    })
    .catch(error => {
      console.error('Error:', error);
    });
});
