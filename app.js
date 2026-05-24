const { createApp } = Vue;

createApp({
    data() {
        return {
          
            form: {
                fullName: '',
                dob: '',
                gender: '',
                totalVisitors: '1',
                children: '0',
                accommodation: '',
                cardName: '',
                cardNumber: '',
                expiryDate: '',
                cvc: ''
            },
            
            errors: {},
           
            generalError: '',
            
            places: [],
            isLoadingPlaces: false,
            placesError: '',
            
            selectedPlaces: [],
            
            
            accommodationOptions: [
                'No accommodation needed',
                'Forest View Hotel',
                'Totoro Family Inn',
                'Witch Valley Guesthouse',
                'Luxury Ghibli Resort'
            ],
            
            showSummary: false
        }
    },
    computed: {
      
        maskedCardNumber() {
            const numStr = String(this.form.cardNumber).trim();
            if (numStr.length >= 4) {
                return numStr.slice(-4);
            }
            return numStr; 
        }
    },
    mounted() {
    
        this.loadPlaces();
    },
    methods: {
     
        async loadPlaces() {
            this.isLoadingPlaces = true;
            try {
                const response = await fetch('ghibli_park.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch JSON data');
                }
                this.places = await response.json();
            } catch (error) {
                this.placesError = 'Could not load the Ghibli Park places.';
                console.error('Error fetching data:', error);
            } finally {
                this.isLoadingPlaces = false;
            }
        },

      
        isSelected(place) {
            return this.selectedPlaces.some(p => p.id === place.id);
        },

        togglePlace(place) {
            if (this.isSelected(place)) {
                this.selectedPlaces = this.selectedPlaces.filter(p => p.id !== place.id);
            } else {
                this.selectedPlaces.push(place);
            }
        },

      
        clearErrors() {
            this.errors = {};
            this.generalError = '';
            this.showSummary = false;
        },

  
        validateForm() {
            let isValid = true;

         
            if (!this.form.fullName.trim()) { this.errors.fullName = 'Full name is required.'; isValid = false; }
            if (!this.form.dob) { this.errors.dob = 'Date of birth is required.'; isValid = false; }
            if (!this.form.gender) { this.errors.gender = 'Please select your gender.'; isValid = false; }

          
            if (this.selectedPlaces.length === 0) { 
                this.errors.places = 'Please select at least one Ghibli Park place.'; 
                isValid = false; 
            }

           
            if (!this.form.totalVisitors || this.form.totalVisitors < 1) { 
                this.errors.totalVisitors = 'At least 1 visitor is required.'; 
                isValid = false; 
            }
            if (this.form.children === '' || this.form.children < 0) { 
                this.errors.children = 'Valid number of children is required.'; 
                isValid = false; 
            }

          
            if (!this.form.accommodation) { 
                this.errors.accommodation = 'Please select an accommodation option.'; 
                isValid = false; 
            }

           
            if (!this.form.cardName.trim()) { this.errors.cardName = 'Name on card is required.'; isValid = false; }
            if (!this.form.cardNumber.trim()) { this.errors.cardNumber = 'Card number is required.'; isValid = false; }
            if (!this.form.expiryDate) { this.errors.expiryDate = 'Expiration date is required.'; isValid = false; }
            if (!this.form.cvc.trim()) { this.errors.cvc = 'CVC is required.'; isValid = false; }

           
            if (!isValid) {
                this.generalError = 'There are mandatory items pending to be filled. Please complete the required fields.';
            }

            return isValid;
        },

        
        generateItinerary() {
            this.clearErrors();
            if (this.validateForm()) {
                this.showSummary = true;
            }
        }
    }
}).mount('#app');