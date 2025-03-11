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
        flashcards[editIndexInForm] = { subject, topic, priority, front, back };
        localStorage.removeItem('editFlashcardIndex');
      } else if (editIndex !== null) {
        flashcards[editIndex] = { subject, topic, priority, front, back };
      } else {
        flashcards.push({ subject, topic, priority, front, back });
      }
      
      localStorage.setItem('flashcards', JSON.stringify(flashcards));
      alert('Flashcard saved successfully!');
      form.reset();
      
      window.location.href = 'flashcard-sets.html';
    });
  }

  // ----- SORTING HELPERS -----
  function insertAlphabetically(sortedArray, flashcard) {
    let left = 0, right = sortedArray.length - 1;
    const currentSubject = flashcard.subject.toLowerCase();
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midSubject = sortedArray[mid].subject.toLowerCase();
      
      if (currentSubject < midSubject) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    sortedArray.splice(left, 0, flashcard);
  }
  
  function insertReverseAlphabetically(sortedArray, flashcard) {
    let left = 0, right = sortedArray.length - 1;
    const currentSubject = flashcard.subject.toLowerCase();
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midSubject = sortedArray[mid].subject.toLowerCase();
      
      if (currentSubject > midSubject) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    sortedArray.splice(left, 0, flashcard);
  }

  function sortAlphabetically(flashcards) {
    const sorted = [];
    for (let card of flashcards) {
      insertAlphabetically(sorted, card);
    }
    return sorted;
  }
  
  function sortReverseAlphabetically(flashcards) {
    const sorted = [];
    for (let card of flashcards) {
      insertReverseAlphabetically(sorted, card);
    }
    return sorted;
  }
  
  function sortByPriority(flashcards) {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return flashcards.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }
  
  window.applySort = function () {
    const sortCriteria = document.getElementById('sortCriteria').value;
    const flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
    
    if (sortCriteria === 'alphabetical') {
      localStorage.setItem('flashcards', JSON.stringify(sortAlphabetically(flashcards)));
    } else if (sortCriteria === 'reverse-alphabetical') {
      localStorage.setItem('flashcards', JSON.stringify(sortReverseAlphabetically(flashcards)));
    } else if (sortCriteria === 'priority') {
      localStorage.setItem('flashcards', JSON.stringify(sortByPriority(flashcards)));
    }
    
    renderFlashcards();
  };
  
  function renderFlashcards() {
    const flashcardsDiv = document.getElementById('flashcards');
    if (flashcardsDiv) {
      const flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
      
      flashcardsDiv.innerHTML = flashcards.map((flashcard, index) => `
        <div class="flashcard" id="flashcard-${index}">
          <div class="flashcard-content front" style="display: block;">
            <h3>${flashcard.front || 'No Front Text'}</h3>
          </div>
          <div class="flashcard-content back" style="display: none;">
            <h3>${flashcard.back || 'No Back Text'}</h3>
          </div>
          <p><strong>Subject:</strong> ${flashcard.subject}</p>
          <p><strong>Topic:</strong> ${flashcard.topic}</p>
          <p><strong>Priority:</strong> ${flashcard.priority}</p>
          <div class="flashcard-actions">
            <button onclick="flipFlashcard(${index})">Flip</button>
            <button onclick="editFlashcard(${index})">Edit</button>
            <button onclick="deleteFlashcard(${index})">Delete</button>
          </div>
        </div>
      `).join('');
    }
  }

  window.flipFlashcard = function (index) {
    const flashcardEl = document.getElementById(`flashcard-${index}`);
    if (!flashcardEl) return;
    const frontEl = flashcardEl.querySelector('.front');
    const backEl = flashcardEl.querySelector('.back');
    frontEl.style.display = frontEl.style.display === 'none' ? 'block' : 'none';
    backEl.style.display = backEl.style.display === 'none' ? 'block' : 'none';
  };
  window.deleteFlashcard = function (index) {
    let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];

    if (index >= 0 && index < flashcards.length) {
        flashcards.splice(index, 1); // Remove the flashcard at the given index
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
        renderFlashcards(); // Re-render the flashcards after deletion
    } else {
        console.error("Invalid index for deletion:", index);
    }
};


  if (document.getElementById('flashcards')) {
    renderFlashcards();
  }
});
