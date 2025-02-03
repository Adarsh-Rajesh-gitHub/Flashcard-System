document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('flashcard-form');
  
  // Check if we're editing a flashcard
  const editIndex = localStorage.getItem('editFlashcardIndex');
  
  if (editIndex !== null) {
    const flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
    const flashcardToEdit = flashcards[editIndex];
    
    // Populate form with existing flashcard data
    document.getElementById('subject').value = flashcardToEdit.subject;
    document.getElementById('topic').value = flashcardToEdit.topic;
    document.getElementById('priority').value = flashcardToEdit.priority;
    
    // Change form submit button text
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.textContent = 'Update Flashcard';
    
    // Remove the edit index from localStorage
    localStorage.removeItem('editFlashcardIndex');
  }
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const subject = document.getElementById('subject').value;
      const topic = document.getElementById('topic').value;
      const priority = document.getElementById('priority').value;
      
      const flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
      
      // Check if we're updating an existing flashcard
      const editIndex = localStorage.getItem('editFlashcardIndex');
      
      if (editIndex !== null) {
        // Update existing flashcard
        flashcards[editIndex] = { subject, topic, priority };
        localStorage.removeItem('editFlashcardIndex');
      } else {
        // Add new flashcard
        flashcards.push({ subject, topic, priority });
      }
      
      localStorage.setItem('flashcards', JSON.stringify(flashcards));
      alert('Flashcard saved successfully!');
      form.reset();
      
      // Redirect to flashcard sets page
      window.location.href = 'flashcard-sets.html';
    });
  }

  function renderFlashcards() {
    const flashcardsDiv = document.getElementById('flashcards');
    if (flashcardsDiv) {
      const flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
      flashcardsDiv.innerHTML = flashcards
        .map(
          (flashcard, index) => `
          <div class="flashcard">
            <h3>${flashcard.subject}</h3>
            <p>Topic: ${flashcard.topic}</p>
            <p>Priority: ${flashcard.priority}</p>
            <div class="flashcard-actions">
              <button onclick="editFlashcard(${index})">Edit</button>
              <button onclick="deleteFlashcard(${index})">Delete</button>
            </div>
          </div>
        `
        )
        .join('');
    }
  }

  // Add delete functionality
  window.deleteFlashcard = function(index) {
    const confirmDelete = confirm('Are you sure you want to delete this flashcard?');
    if (confirmDelete) {
      const flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
      flashcards.splice(index, 1);
      localStorage.setItem('flashcards', JSON.stringify(flashcards));
      renderFlashcards();
    }
  }

  // Edit functionality to navigate to add/edit page
  window.editFlashcard = function(index) {
    // Store the index of the flashcard to edit
    localStorage.setItem('editFlashcardIndex', index);
    // Navigate to add/edit page
    window.location.href = 'addflashcards.html';
  }

  // Initial render of flashcards
  if (document.getElementById('flashcards')) {
    renderFlashcards();
  }
});