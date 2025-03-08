// Base URL for API calls (adjust if your backend runs on a different port)
const BASE_URL = 'http://localhost:8080';

// Fetch and display the list of citizens
async function fetchCitizens() {
  try {
    const tableBody = document.querySelector('#citizens-table tbody');
    tableBody.innerHTML = '<tr><td colspan="7" class="loading-data"><i class="fas fa-spinner fa-spin"></i> Loading citizens data...</td></tr>';
    
    const response = await fetch(`${BASE_URL}/citizens`);
    if (!response.ok) {
      throw new Error('Failed to fetch citizens.');
    }
    const citizens = await response.json();
    displayCitizens(citizens);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to load citizens. Please check the backend.');
  }
}

// Display citizens in the table
function displayCitizens(citizens) {
  const tableBody = document.querySelector('#citizens-table tbody');
  tableBody.innerHTML = ''; // Clear existing rows

  if (citizens.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="7" class="no-data">No citizens found</td></tr>';
    return;
  }

  citizens.forEach(citizen => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${citizen.id}</td>
            <td>${citizen.firstName || '-'}</td>
            <td>${citizen.lastName || '-'}</td>
            <td>${formatDate(citizen.dateOfBirth) || '-'}</td>
            <td>${citizen.gender || '-'}</td>
            <td>${citizen.civilStatus || '-'}</td>
            <td>
                <button class="btn btn-edit" onclick="editCitizen(${citizen.id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteCitizen(${citizen.id})">Delete</button>
            </td>
        `;
    tableBody.appendChild(row);
  });
}

// Format date to a more readable format
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Search citizens
async function searchCitizens(event) {
  event.preventDefault(); // Prevent form submission
  const searchType = document.getElementById('search-type').value.trim(); // Get search type (ID or Last Name)
  const query = document.getElementById('search-query').value.trim(); // Get search query

  if (!query) {
    alert('Please enter a search query.');
    return;
  }

  try {
    const tableBody = document.querySelector('#citizens-table tbody');
    tableBody.innerHTML = '<tr><td colspan="7" class="loading-data"><i class="fas fa-spinner fa-spin"></i> Searching...</td></tr>';
    
    const response = await fetch(`${BASE_URL}/citizens?searchType=${searchType}&query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to search citizens.');
    }

    const citizens = await response.json();

    // Display results
    if (Array.isArray(citizens)) {
      displayCitizens(citizens); // For multiple results (e.g., last name search)
    } else if (citizens !== null) {
      displayCitizens([citizens]); // Wrap single citizen in an array for consistency
    } else {
      alert('No matching citizen found.');
      displayCitizens([]); // Clear the table if no results
    }
  } catch (error) {
    console.error('Error:', error);
    alert(error.message);
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  // Attach event listeners to forms
  document.getElementById('add-citizen-form').addEventListener('submit', addNewCitizen);
  document.getElementById('search-form').addEventListener('submit', searchCitizens); // Attach listener to search form
  document.getElementById('marriage-form').addEventListener('submit', registerMarriage);
  document.getElementById('divorce-form').addEventListener('submit', registerDivorce);
  document.getElementById('birth-form').addEventListener('submit', registerBirth);
});

// Add a new citizen
async function addNewCitizen(event) {
  event.preventDefault(); // Prevent form submission
  const firstName = document.getElementById('add-first-name').value.trim();
  const lastName = document.getElementById('add-last-name').value.trim();
  const dateOfBirth = document.getElementById('add-date-of-birth').value.trim();
  const gender = document.getElementById('add-gender').value.trim();
  const civilStatus = document.getElementById('add-civil-status').value.trim();

  if (!firstName || !lastName || !dateOfBirth || !gender || !civilStatus) {
    alert('Please fill in all required fields.');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/citizens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        lastName,
        dateOfBirth,
        gender,
        civilStatus,
        spouseId: null // New citizens have no spouse initially
      })
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to add citizen.');
    }

    alert('Citizen added successfully.');
    event.target.reset(); // Reset the form
    fetchCitizens(); // Refresh the citizen list
  } catch (error) {
    console.error('Error:', error);
    alert(error.message);
  }
}

// Edit a citizen
async function editCitizen(id) {
  try {
    // First fetch the current citizen data
    const response = await fetch(`${BASE_URL}/citizens?searchType=id&query=${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch citizen data.');
    }
    
    const citizen = await response.json();
    if (!citizen) {
      throw new Error('Citizen not found.');
    }
    
    // Create a modal for editing
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Edit Citizen</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <form id="edit-citizen-form">
            <div class="form-group">
              <label for="edit-first-name">First Name:</label>
              <input type="text" id="edit-first-name" value="${citizen.firstName || ''}" required>
            </div>
            <div class="form-group">
              <label for="edit-last-name">Last Name:</label>
              <input type="text" id="edit-last-name" value="${citizen.lastName || ''}" required>
            </div>
            <div class="form-group">
              <label for="edit-date-of-birth">Date of Birth:</label>
              <input type="date" id="edit-date-of-birth" value="${citizen.dateOfBirth || ''}" required>
            </div>
            <div class="form-group">
              <label for="edit-gender">Gender:</label>
              <select id="edit-gender" required>
                <option value="male" ${citizen.gender === 'male' ? 'selected' : ''}>Male</option>
                <option value="female" ${citizen.gender === 'female' ? 'selected' : ''}>Female</option>
              </select>
            </div>
            <div class="form-group">
              <label for="edit-civil-status">Civil Status:</label>
              <select id="edit-civil-status" required>
                <option value="single" ${citizen.civilStatus === 'single' ? 'selected' : ''}>Single</option>
                <option value="married" ${citizen.civilStatus === 'married' ? 'selected' : ''}>Married</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-success">Save Changes</button>
              <button type="button" class="btn btn-danger modal-cancel">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles if not already added
    if (!document.getElementById('modal-styles')) {
      const style = document.createElement('style');
      style.id = 'modal-styles';
      style.textContent = `
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          box-shadow: var(--shadow-lg);
          animation: modalFadeIn 0.3s;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }
        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text-lighter);
        }
        .modal-body {
          padding: 1.5rem;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Handle form submission
    const editForm = document.getElementById('edit-citizen-form');
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const updatedCitizen = {
        firstName: document.getElementById('edit-first-name').value.trim(),
        lastName: document.getElementById('edit-last-name').value.trim(),
        dateOfBirth: document.getElementById('edit-date-of-birth').value.trim(),
        gender: document.getElementById('edit-gender').value.trim(),
        civilStatus: document.getElementById('edit-civil-status').value.trim()
      };
      
      try {
        const updateResponse = await fetch(`${BASE_URL}/citizens/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedCitizen)
        });
        
        if (!updateResponse.ok) {
          const errorMessage = await updateResponse.text();
          throw new Error(errorMessage || 'Failed to update citizen.');
        }
        
        alert('Citizen updated successfully.');
        modal.remove();
        fetchCitizens(); // Refresh the citizen list
      } catch (error) {
        console.error('Error:', error);
        alert(error.message);
      }
    });
    
    // Close modal on button click
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-cancel').addEventListener('click', () => modal.remove());
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  } catch (error) {
    console.error('Error:', error);
    alert(error.message);
  }
}

// Delete a citizen
async function deleteCitizen(id) {
  // Create a confirmation modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content confirmation-modal">
      <div class="modal-header">
        <h3>Confirm Deletion</h3>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to delete this citizen? This action cannot be undone.</p>
        <div class="form-actions">
          <button class="btn btn-danger confirm-delete">Delete</button>
          <button class="btn modal-cancel">Cancel</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Handle delete confirmation
  modal.querySelector('.confirm-delete').addEventListener('click', async () => {
    try {
      const response = await fetch(`${BASE_URL}/citizens/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Failed to delete citizen.');
      }

      alert('Citizen deleted successfully.');
      modal.remove();
      fetchCitizens(); // Refresh the citizen list
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  });
  
  // Close modal on button click
  modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
  modal.querySelector('.modal-cancel').addEventListener('click', () => modal.remove());
  
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

async function registerMarriage(event) {
  event.preventDefault(); // Prevent form submission
  const citizenId1 = document.getElementById('marriage-citizen-id1').value.trim();
  const citizenId2 = document.getElementById('marriage-citizen-id2').value.trim();

  if (!citizenId1 || !citizenId2) {
    alert('Please select both citizens.');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/marriages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ citizenId1, citizenId2 }) // Send as JSON
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to register marriage.');
    }

    alert('Marriage registered successfully.');
    event.target.reset(); // Reset the form
    fetchCitizens(); // Refresh the citizen list
  } catch (error) {
    console.error('Error:', error);
    alert(error.message);
  }
}

// Register a divorce
async function registerDivorce(event) {
  event.preventDefault(); // Prevent form submission
  const citizenId = document.getElementById('divorce-citizen-id').value.trim();

  if (!citizenId) {
    alert('Please select a citizen.');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/divorces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ citizenId }) // Send as JSON
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to register divorce.');
    }

    alert('Divorce registered successfully.');
    event.target.reset(); // Reset the form
    fetchCitizens(); // Refresh the citizen list
  } catch (error) {
    console.error('Error:', error);
    alert(error.message);
  }
}

// Register a birth
async function registerBirth(event) {
  event.preventDefault(); // Prevent form submission
  const firstName = document.getElementById('birth-first-name').value.trim();
  const gender = document.getElementById('birth-gender').value.trim();
  const parentId1 = document.getElementById('birth-parent-id1').value.trim();
  const parentId2 = document.getElementById('birth-parent-id2').value.trim();

  if (!firstName || !gender || !parentId1 || !parentId2) {
    alert('Please fill in all required fields.');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/births`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        gender,
        parentId1,
        parentId2
      }) // Send as JSON
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to register birth.');
    }

    alert('Birth registered successfully.');
    event.target.reset(); // Reset the form
    fetchCitizens(); // Refresh the citizen list
  } catch (error) {
    console.error('Error:', error);
    alert(error.message);
  }
}