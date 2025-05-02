document.addEventListener('DOMContentLoaded', function() {
    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupération des données du formulaire
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value
            };
            
            // Ici, vous pouvez ajouter la logique pour envoyer les données à votre backend
            console.log('Données du formulaire:', formData);
            
            // Affichage d'un message de confirmation
            alert('Merci pour votre message ! Nous vous contacterons bientôt.');
            
            // Réinitialisation du formulaire
            contactForm.reset();
        });
    }
    
    // Smooth scrolling pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Ajustement pour le header fixe
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animation au scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initialisation des styles pour l'animation
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Écouteur d'événement pour le scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Appel initial pour vérifier les éléments visibles au chargement
    animateOnScroll();

    const form = document.getElementById('multi-step-form');
    const steps = document.querySelectorAll('.form-step');
    const progressBar = document.querySelector('.progress');
    let currentStep = 0;

    // Gestion du formulaire principal
    if (form) {
        // Empêcher la soumission par défaut du formulaire
        form.onsubmit = function(e) {
            e.preventDefault();
            return false;
        };

        // Gestionnaire pour le bouton de soumission
        const submitButton = form.querySelector('.submit-button');
        if (submitButton) {
            submitButton.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Bouton de soumission cliqué');
                
                if (validateStep(currentStep)) {
                    const formData = new FormData(form);
                    
                    // Vérification uniquement du statut de locataire
                    if (formData.get('statut') === 'locataire') {
                        showErrorStep();
                    } else {
                        // Envoyer l'email avant d'afficher la confirmation
                        sendEmail(formData).then(success => {
                            if (success) {
                                showConfirmationStep();
                            } else {
                                alert('Une erreur est survenue lors de l\'envoi des données. Veuillez réessayer.');
                            }
                        });
                    }
                }
            });
        }
    }

    // Fonction de réinitialisation du formulaire
    function resetForm() {
        // Réinitialiser l'étape courante
        currentStep = 0;
        
        // Réinitialiser tous les champs du formulaire
        if (form) {
            form.reset();
        }
        
        // Cacher toutes les étapes sauf la première
        steps.forEach((step, index) => {
            if (index === 0) {
                step.style.display = 'block';
            } else {
                step.style.display = 'none';
            }
        });
        
        // Réinitialiser la barre de progression
        if (progressBar) {
            progressBar.style.width = '5%';
        }
        
        // Réinitialiser le pourcentage affiché
        const percentageElement = document.querySelector('.step-percentage');
        if (percentageElement) {
            percentageElement.textContent = '5%';
        }
    }

    // Appeler la réinitialisation au chargement de la page
    resetForm();

    // Réinitialiser quand l'utilisateur quitte la page
    window.addEventListener('beforeunload', function() {
        resetForm();
    });

    // Gestion des boutons suivant/précédent
    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateStep(currentStep)) {
                // Vérifier l'éligibilité avant de passer à l'étape suivante
                const formData = new FormData(form);
                const currentStepElement = steps[currentStep];
                
                // Vérification uniquement pour l'étape 2 (statut - locataire)
                if (currentStepElement.id === 'step-2' && formData.get('statut') === 'locataire') {
                    showErrorStep();
                    return;
                }
                
                // Si tout est OK, passer à l'étape suivante
                nextStep();
            }
        });
    });

    document.querySelectorAll('.prev-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            prevStep();
        });
    });

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            if (index === stepIndex) {
                step.style.display = 'block';
                step.classList.add('active');
            } else {
                step.style.display = 'none';
                step.classList.remove('active');
            }
        });
        
        // Mise à jour de la barre de progression
        const progress = ((stepIndex + 1) / steps.length) * 100;
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        // Mise à jour du pourcentage
        const percentageElement = document.querySelector('.step-percentage');
        if (percentageElement) {
            percentageElement.textContent = `${Math.round(progress)}%`;
        }
    }

    function nextStep() {
        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
        }
    }

    function prevStep() {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    }

    function validatePostalCode(code) {
        return /^[0-9]{5}$/.test(code);
    }

    function validatePhone(phone) {
        return /^0[1-9][0-9]{8}$/.test(phone);
    }

    function validateStep(stepIndex) {
        const currentStepElement = steps[stepIndex];
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
                
                // Validation spécifique pour le code postal et le téléphone
                if (field.id === 'code_postal' && !validatePostalCode(field.value)) {
                    isValid = false;
                    field.classList.add('error');
                    alert('Veuillez entrer un code postal valide (5 chiffres)');
                }
                
                if (field.id === 'telephone' && !validatePhone(field.value)) {
                    isValid = false;
                    field.classList.add('error');
                    alert('Veuillez entrer un numéro de téléphone valide (10 chiffres commençant par 0)');
                }
            }
        });

        return isValid;
    }

    // Fonction pour afficher l'étape de confirmation
    function showConfirmationStep() {
        console.log('Affichage de l\'étape de confirmation');
        
        // Cacher toutes les étapes
        steps.forEach(step => {
            step.style.display = 'none';
        });
        
        // Afficher l'étape de confirmation
        const confirmationStep = document.getElementById('confirmation-step');
        if (confirmationStep) {
            confirmationStep.style.display = 'block';
            console.log('Étape de confirmation trouvée et affichée');
        } else {
            console.error('Étape de confirmation non trouvée');
        }
        
        // Scroll en haut de la page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Fonction pour afficher l'étape d'erreur
    function showErrorStep() {
        console.log('Affichage de l\'étape d\'erreur');
        
        // Cacher toutes les étapes
        steps.forEach(step => {
            step.style.display = 'none';
        });
        
        // Afficher l'étape d'erreur
        const errorStep = document.getElementById('error-step');
        if (errorStep) {
            errorStep.style.display = 'block';
            console.log('Étape d\'erreur trouvée et affichée');
            
            // Ajouter le gestionnaire d'événements pour le bouton Retour
            const prevButton = errorStep.querySelector('.prev-btn');
            if (prevButton) {
                prevButton.onclick = function() {
                    // Revenir à l'étape précédente
                    prevStep();
                };
            }
        } else {
            console.error('Étape d\'erreur non trouvée');
        }
        
        // Scroll en haut de la page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Fonction pour envoyer l'email
    async function sendEmail(formData) {
        try {
            const templateParams = {
                type_travaux: formData.get('type_travaux'),
                statut: formData.get('statut'),
                type_logement: formData.get('type_logement'),
                annee_construction: formData.get('annee_construction'),
                travaux_anterieurs: formData.get('travaux_anterieurs'),
                type_chauffage: formData.get('type_chauffage'),
                code_postal: formData.get('code_postal'),
                email: formData.get('email'),
                nom: formData.get('nom'),
                telephone: formData.get('telephone')
            };

            const response = await emailjs.send(
                "service_p2k9216", // Service ID
                "template_2jmhoqb", // Template ID
                templateParams
            );

            console.log('Email envoyé avec succès:', response);
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
            return false;
        }
    }
});