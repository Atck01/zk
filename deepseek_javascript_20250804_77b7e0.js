// Profile image upload
document.addEventListener('DOMContentLoaded', () => {
  const profileImageInput = document.getElementById('profileImageInput');
  const profileImageForm = document.getElementById('profileImageForm');
  
  if (profileImageInput && profileImageForm) {
    profileImageInput.addEventListener('change', () => {
      profileImageForm.submit();
    });
  }
  
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});

// Toast notifications
function showToast(type, message) {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;
  
  const toastEl = document.createElement('div');
  toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');
  
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  
  toastContainer.appendChild(toastEl);
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
  
  // Remove toast after it hides
  toastEl.addEventListener('hidden.bs.toast', () => {
    toastEl.remove();
  });
}

// Display any flash messages
document.addEventListener('DOMContentLoaded', () => {
  const successMsg = document.querySelector('.alert-success');
  const errorMsg = document.querySelector('.alert-danger');
  
  if (successMsg) {
    showToast('success', successMsg.textContent);
  }
  
  if (errorMsg) {
    showToast('danger', errorMsg.textContent);
  }
});