// class for Medicine
class Medicine {
    constructor(name, manufacturer, expirationDate, quantity) {
      this.id = Date.now().toString();
      this.name = name;
      this.manufacturer = manufacturer;
      this.expirationDate = new Date(expirationDate).toISOString().split('T')[0];
      this.quantity = quantity;
      console.log(`New ${this.constructor.name} created:`, this);
    }
  }
  
  // subclass for regular medicines
  class RegularMedicine extends Medicine {
    constructor(name, manufacturer, expirationDate, quantity) {
      super(name, manufacturer, expirationDate, quantity);
      this.prescriptionRequired = false; // regular medicines do not need a prescription
      console.log(`new ${this.constructor.name} created:`, this);
    }
  }
  
  // subclass for prescription medicines
  class PrescriptionMedicine extends Medicine {
    constructor(name, manufacturer, expirationDate, quantity) {
      super(name, manufacturer, expirationDate, quantity);
      this.prescriptionRequired = true; // prescription medicines require a prescription
      console.log(`New ${this.constructor.name} created:`, this);
    }
  }

  // inventory class for managing the medicines
  class Inventory {
    static getAllMedicines() {
      const medicines = JSON.parse(localStorage.getItem('medicines')) || [];
      console.log('Retrieved medicines from localStorage:', medicines);
      return medicines;
    }
  
    static saveMedicine(medicine) {
      const medicines = Inventory.getAllMedicines();
      medicines.push(medicine);
      localStorage.setItem('medicines', JSON.stringify(medicines));
      console.log('Medicine saved to localStorage:', medicine);
    }
  
    static deleteMedicine(productId) {
      const medicines = Inventory.getAllMedicines().filter(medicine => medicine.id !== productId);
      localStorage.setItem('medicines', JSON.stringify(medicines));
      console.log('Medicine deleted from localStorage:', productId);
    }
  }
  
  // Event listener for DOM content loaded
  document.addEventListener('DOMContentLoaded', () => {
    displayMedicines();
  
    const form = document.getElementById('medicineForm');
  
    form.addEventListener('submit', event => {
      event.preventDefault();
  
      clearErrors();
  
      const productName = document.getElementById('productName').value;
      const manufacturer = document.getElementById('manufacturer').value;
      const expirationDate = document.getElementById('expirationDate').value;
      const quantity = document.getElementById('quantity').value;
      const prescriptionRequired = document.getElementById('prescriptionRequired').value === 'yes';
  
      let valid = true;
  
      if (!productName) {
        showError('Product Name is required.', 'productName');
        valid = false;
      }
  
      if (!manufacturer) {
        showError('Manufacturer is required.', 'manufacturer');
        valid = false;
      }
  
      if (!expirationDate) {
        showError('Expiration Date is required.', 'expirationDate');
        valid = false;
      }
  
      if (!quantity) {
        showError('Quantity is required.', 'quantity');
        valid = false;
      }
  
      if (!valid) return;
  
      // Create a new instance of RegularMedicine or PrescriptionMedicine based on prescription or not
      let medicine;
      if (prescriptionRequired) {
        medicine = new PrescriptionMedicine(productName, manufacturer, expirationDate, quantity);
      } else {
        medicine = new RegularMedicine(productName, manufacturer, expirationDate, quantity);
      }
  
      Inventory.saveMedicine(medicine);
      displayMedicines();
      form.reset();
    });
  
    function displayMedicines() {
      const medicines = Inventory.getAllMedicines();
      const tableBody = document.querySelector('#medicineTable tbody');
      tableBody.innerHTML = '';
      medicines.forEach(medicine => {
        const row = tableBody.insertRow();
        row.innerHTML = `
          <td>${medicine.name}</td>
          <td>${medicine.id}</td>
          <td>${medicine.manufacturer}</td>
          <td>${medicine.expirationDate}</td>
          <td>${medicine.quantity}</td>
          <td>${medicine.prescriptionRequired ? 'Yes' : 'No'}</td>
          <td><button onclick="deleteMedicine('${medicine.id}')">Delete</button></td>
        `;
      });
    }
  
    function showError(message, inputId) {
      const inputElement = document.getElementById(inputId);
      const errorElement = document.createElement('p');
      errorElement.textContent = message;
      errorElement.style.color = 'red';
      inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
    }
  
    function clearErrors() {
      const errorElements = document.querySelectorAll('form p');
      errorElements.forEach(element => element.remove());
    }
  
    window.deleteMedicine = function (productId) {
      Inventory.deleteMedicine(productId);
      displayMedicines();
    }
  });


  
  
  