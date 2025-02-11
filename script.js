document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('flashcard-form');
  
  // Check if we're editing a flashcard
  const editIndex = localStorage.getItem('editFlashcardIndex');
  
  if (editIndex !== null) {
    const flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
    const flashcardToEdit = flashcards[editIndex];
    
    // Populate form with existing flashcard data, if form is present
    if (form && flashcardToEdit) {
      document.getElementById('subject').value = flashcardToEdit.subject || '';
      document.getElementById('topic').value = flashcardToEdit.topic || '';
      document.getElementById('priority').value = flashcardToEdit.priority || '';
      document.getElementById('front').value = flashcardToEdit.front || '';
      document.getElementById('back').value = flashcardToEdit.back || '';
      
      // Change form submit button text
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.textContent = 'Update Flashcard';
      }
    }
    
    // Remove the edit index from localStorage so we don't keep editing
    localStorage.removeItem('editFlashcardIndex');
  }
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const subject = document.getElementById('subject').value;
      const topic = document.getElementById('topic').value;
      const priority = document.getElementById('priority').value;
      const front = document.getElementById('front').value;
      const back = document.getElementById('back').value;
      
      const flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
      
      // Check if we're updating an existing flashcard
      const editIndexInForm = localStorage.getItem('editFlashcardIndex');
      
      if (editIndexInForm !== null) {
        // Update existing flashcard
        flashcards[editIndexInForm] = { subject, topic, priority, front, back };
        localStorage.removeItem('editFlashcardIndex');
      } else if (editIndex !== null) {
        // We had an editIndex from earlier on load
        flashcards[editIndex] = { subject, topic, priority, front, back };
      } else {
        // Add new flashcard
        flashcards.push({ subject, topic, priority, front, back });
      }
      
      localStorage.setItem('flashcards', JSON.stringify(flashcards));
      alert('Flashcard saved successfully!');
      form.reset();
      
      // Redirect to flashcard sets page
      window.location.href = 'flashcard-sets.html';
    });
  }

  // Function to render flashcards (on flashcard-sets.html)
  function renderFlashcards() {
    const flashcardsDiv = document.getElementById('flashcards');
    if (flashcardsDiv) {
      const flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
      
      flashcardsDiv.innerHTML = flashcards
        .map((flashcard, index) => {
          return `
            <div class="flashcard" id="flashcard-${index}">
              <!-- Front / Back content toggles on Flip -->
              <div class="flashcard-content front" style="display: block;">
                <h3>${flashcard.front || 'No Front Text'}</h3>
              </div>
              <div class="flashcard-content back" style="display: none;">
                <h3>${flashcard.back || 'No Back Text'}</h3>
              </div>
              
              <!-- Additional info below -->
              <p><strong>Subject:</strong> ${flashcard.subject}</p>
              <p><strong>Topic:</strong> ${flashcard.topic}</p>
              <p><strong>Priority:</strong> ${flashcard.priority}</p>
              
              <div class="flashcard-actions">
                <button onclick="flipFlashcard(${index})">Flip</button>
                <button onclick="editFlashcard(${index})">Edit</button>
                <button onclick="deleteFlashcard(${index})">Delete</button>
              </div>
            </div>
          `;
        })
        .join('');
    }
  }

  // Flip functionality
  window.flipFlashcard = function(index) {
    const flashcardEl = document.getElementById(`flashcard-${index}`);
    if (!flashcardEl) return;
    
    const frontEl = flashcardEl.querySelector('.front');
    const backEl = flashcardEl.querySelector('.back');
    
    // Toggle front/back display
    if (frontEl.style.display === 'none') {
      frontEl.style.display = 'block';
      backEl.style.display = 'none';
    } else {
      frontEl.style.display = 'none';
      backEl.style.display = 'block';
    }
  };

  // Delete functionality
  window.deleteFlashcard = function(index) {
    const confirmDelete = confirm('Are you sure you want to delete this flashcard?');
    if (confirmDelete) {
      const flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
      flashcards.splice(index, 1);
      localStorage.setItem('flashcards', JSON.stringify(flashcards));
      renderFlashcards();
    }
  };

  // Edit functionality
  window.editFlashcard = function(index) {
    localStorage.setItem('editFlashcardIndex', index);
    // Navigate to add/edit page
    window.location.href = 'addflashcards.html';
  };

  // If we are on the flashcard-sets page, render them
  if (document.getElementById('flashcards')) {
    renderFlashcards();
  }
});
