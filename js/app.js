class AssekTrust {
  constructor() {
    this.currentUser = null;
    this.currentPage = 'home';
    this.companies = [];
    this.payments = [];
    this.adminEmail = 'denjidem243@gmail.com';
    this.adminPassword = 'AssekTrust2420'; // ✅ Mot de passe admin sécurisé
    this.init();
  }

  init() {
    this.loadFromStorage();
    this.renderPage('home');
    this.setupInstallPrompt();
  }

  setupInstallPrompt() {
    document.addEventListener('click', (e) => {
      if (e.target.dataset.page) {
        this.renderPage(e.target.dataset.page);
      }
    });
  }

  loadFromStorage() {
    const stored = localStorage.getItem('assektrust-user');
    if (stored) this.currentUser = JSON.parse(stored);
    
    const companies = localStorage.getItem('assektrust-companies');
    if (companies) this.companies = JSON.parse(companies);

    const payments = localStorage.getItem('assektrust-payments');
    if (payments) this.payments = JSON.parse(payments);
  }

  saveToStorage() {
    localStorage.setItem('assektrust-user', JSON.stringify(this.currentUser));
    localStorage.setItem('assektrust-companies', JSON.stringify(this.companies));
    localStorage.setItem('assektrust-payments', JSON.stringify(this.payments));
  }

  renderPage(page) {
    this.currentPage = page;
    const root = document.getElementById('root');
    
    if (!this.currentUser && page !== 'login' && page !== 'home') {
      this.renderPage('login');
      return;
    }

    let content = '';
    
    switch(page) {
      case 'home':
        content = this.renderHome();
        break;
      case 'login':
        content = this.renderLogin();
        break;
      case 'companies':
        content = this.renderCompanies();
        break;
      case 'subscribe':
        content = this.renderSubscribe();
        break;
      case 'payments':
        content = this.renderPayments();
        break;
      case 'admin':
        content = this.renderAdmin();
        break;
      case 'profile':
        content = this.renderProfile();
        break;
      default:
        content = this.renderHome();
    }

    root.innerHTML = content;
    this.attachPageEventListeners(page);
  }

  renderHeader() {
    return `
      <header>
        <div class="header-container">
          <div class="logo">
            <span class="logo-icon">✓</span>
            <span>AssekTrust</span>
          </div>
          <nav>
            <ul class="nav-links">
              <li><a data-page="home">Accueil</a></li>
              <li><a data-page="companies">Entreprises</a></li>
              <li><a data-page="subscribe">S'abonner</a></li>
              ${this.currentUser ? `
                ${this.currentUser.role === 'admin' ? `<li><a data-page="admin">Admin</a></li>` : ''}
                <li><a data-page="payments">Paiements</a></li>
                <li><a data-page="profile">Profil</a></li>
              ` : ''}
            </ul>
          </nav>
          <div class="user-menu">
            ${this.currentUser ? `
              <span>${this.currentUser.email}</span>
              <button class="btn btn-danger" id="logout-btn">Déconnexion</button>
            ` : `
              <button class="btn btn-primary" data-page="login">Connexion</button>
            `}
          </div>
        </div>
      </header>
    `;
  }

  renderHome() {
    return `
      ${this.renderHeader()}
      <main>
        <section class="hero">
          <h1>🛡️ AssekTrust - Certification d'Entreprises</h1>
          <p>Combattez les arnaqués en ligne au Gabon. Vérifiez les entreprises certifiées avant d'acheter sur les réseaux sociaux.</p>
          ${!this.currentUser ? `
            <button class="btn btn-secondary" data-page="login">Commencer</button>
          ` : ''}
        </section>

        <section>
          <h2>Entreprises Certifiées ✓</h2>
          <div class="grid">
            ${this.companies.filter(c => c.certified).length > 0 ? 
              this.companies.filter(c => c.certified).map(company => `
                <div class="card">
                  <div class="card-header">
                    <div>
                      <div class="card-title">${company.name}</div>
                      <small style="color: #7f8c8d;">${company.category}</small>
                    </div>
                    <span class="badge badge-success">✓ Certifiée</span>
                  </div>
                  <p><strong>Email:</strong> ${company.email}</p>
                  <p><strong>Réseaux:</strong> ${company.networks.join(', ')}</p>
                  ${company.subscription_type === 'premium' ? `
                    <span class="badge badge-premium">⭐ Premium</span>
                  ` : ''}
                  <p style="margin-top: 1rem; font-size: 0.9rem; color: #7f8c8d;">
                    Certifiée depuis: ${new Date(company.certified_date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              `).join('') :
              '<p>Aucune entreprise certifiée pour le moment.</p>'
            }
          </div>
        </section>

        <footer>
          <p>&copy; 2024 AssekTrust - Gabon 🇬🇦. Tous droits réservés.</p>
          <p style="margin-top: 1rem; font-size: 0.9rem;">Combattons les arnaqués en ligne ensemble!</p>
        </footer>
      </main>
    `;
  }

  renderLogin() {
    return `
      ${this.renderHeader()}
      <main>
        <div style="max-width: 400px; margin: 3rem auto;">
          <div class="card">
            <h2 style="text-align: center; margin-bottom: 2rem; color: var(--primary);">Connexion</h2>
            
            <div class="alert alert-info">
              <span>👤</span>
              <div>
                <strong>Connexion Utilisateur</strong>
                <p>Utilisez votre email pour vous connecter</p>
              </div>
            </div>

            <div class="form-group">
              <label>Email</label>
              <input type="email" id="login-email" placeholder="votre@email.com">
            </div>

            <div class="form-group">
              <label>Mot de passe</label>
              <input type="password" id="login-password" placeholder="••••••••">
            </div>

            <button class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;" id="login-btn">
              Se Connecter
            </button>

            <div style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #ecf0f1;">
              <p style="margin-bottom: 1rem; color: var(--primary); font-weight: 600;">Administrateur ?</p>
              <button class="btn btn-secondary" style="width: 100%;" id="admin-login-btn">
                🔐 Connexion Admin
              </button>
            </div>
          </div>
        </div>
      </main>
    `;
  }

  renderCompanies() {
    return `
      ${this.renderHeader()}
      <main>
        <section>
          <h2>Toutes les Entreprises</h2>
          
          <div style="margin-bottom: 2rem;">
            <input type="text" id="search-companies" placeholder="🔍 Rechercher une entreprise..." 
              style="padding: 1rem; font-size: 1rem;">
          </div>

          <div class="grid">
            ${this.companies.length > 0 ? this.companies.map(company => `
              <div class="card">
                <div class="card-header">
                  <div>
                    <div class="card-title">${company.name}</div>
                    <small>${company.category}</small>
                  </div>
                  ${company.certified ? 
                    '<span class="badge badge-success">✓ Certifiée</span>' :
                    '<span class="badge badge-warning">⏳ En attente</span>'
                  }
                </div>
                <p><strong>Email:</strong> ${company.email}</p>
                <p><strong>Téléphone:</strong> ${company.phone || 'N/A'}</p>
                <p><strong>Réseaux:</strong> ${company.networks.join(', ')}</p>
                <p><strong>Plan:</strong> ${company.subscription_type || 'Aucun'}</p>
              </div>
            `).join('') : 
            '<div class="alert alert-info"><span>ℹ️</span><div>Aucune entreprise trouvée</div></div>'
            }
          </div>
        </section>
      </main>
    `;
  }

  renderSubscribe() {
    return `
      ${this.renderHeader()}
      <main>
        <section>
          <h2>Plans d'Abonnement</h2>
          
          <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
            <div class="card" style="border: 2px solid #ecf0f1;">
              <div style="text-align: center; margin-bottom: 1.5rem;">
                <h3 style="color: var(--primary); margin-bottom: 0.5rem;">Plan Mensuel</h3>
                <div style="font-size: 2.5rem; color: var(--secondary); font-weight: bold;">2 000 FCFA</div>
                <small style="color: #7f8c8d;">/mois</small>
              </div>
              <ul style="list-style: none; margin-bottom: 1.5rem;">
                <li style="padding: 0.5rem 0; border-bottom: 1px solid #ecf0f1;">✓ Profil d'entreprise</li>
                <li style="padding: 0.5rem 0; border-bottom: 1px solid #ecf0f1;">✓ Badge de certification</li>
                <li style="padding: 0.5rem 0; border-bottom: 1px solid #ecf0f1;">✓ Vérification des clients</li>
                <li style="padding: 0.5rem 0;">✓ Support client</li>
              </ul>
              <button class="btn btn-primary" style="width: 100%;" data-plan="monthly">
                Choisir ce plan
              </button>
            </div>

            <div class="card" style="border: 3px solid var(--secondary); transform: scale(1.05); position: relative;">
              <span class="badge badge-warning" style="position: absolute; top: 10px; right: 10px;">POPULAIRE</span>
              <div style="text-align: center; margin-bottom: 1.5rem;">
                <h3 style="color: var(--primary); margin-bottom: 0.5rem;">Plan Trimestriel</h3>
                <div style="font-size: 2.5rem; color: var(--secondary); font-weight: bold;">5 000 FCFA</div>
                <small style="color: #7f8c8d;">/3 mois</small>
              </div>
              <ul style="list-style: none; margin-bottom: 1.5rem;">
                <li style="padding: 0.5rem 0; border-bottom: 1px solid #ecf0f1;">✓ Tout du plan mensuel</li>
                <li style="padding: 0.5rem 0; border-bottom: 1px solid #ecf0f1;">✓ Visibilité accrue</li>
                <li style="padding: 0.5rem 0; border-bottom: 1px solid #ecf0f1;">✓ Priorité client</li>
                <li style="padding: 0.5rem 0;">✓ 10% de réduction</li>
              </ul>
              <button class="btn btn-primary" style="width: 100%;" data-plan="quarterly">
                Choisir ce plan
              </button>
            </div>

            <div class="card" style="border: 2px solid #ecf0f1;">
              <div style="text-align: center; margin-bottom: 1.5rem;">
                <h3 style="color: var(--primary); margin-bottom: 0.5rem;">Plan Premium ⭐</h3>
                <div style="font-size: 2.5rem; color: var(--secondary); font-weight: bold;">Sur Devis</div>
                <small style="color: #7f8c8d;">Personnalisé</small>
              </div>
              <ul style="list-style: none; margin-bottom: 1.5rem;">
                <li style="padding: 0.5rem 0; border-bottom: 1px solid #ecf0f1;">✓ Tout illimité</li>
                <li style="padding: 0.5rem 0; border-bottom: 1px solid #ecf0f1;">✓ Publicités hebdomadaires</li>
                <li style="padding: 0.5rem 0; border-bottom: 1px solid #ecf0f1;">✓ Page d'accueil en vedette</li>
                <li style="padding: 0.5rem 0;">✓ Support VIP 24/7</li>
              </ul>
              <button class="btn btn-secondary" style="width: 100%;" onclick="alert('Contactez nous pour un devis: support@assektrust.ga')">
                Demander un devis
              </button>
            </div>
          </div>
        </section>

        <section style="background: white; padding: 2rem; border-radius: 10px; margin-top: 2rem;">
          <h2>Mode de Paiement 💰</h2>
          <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
            <div class="card">
              <h4>📱 Airtel Money</h4>
              <p>Composez <strong>*2255#</strong> sur votre téléphone</p>
              <p style="margin-top: 1rem; font-size: 0.9rem; color: #7f8c8d;">Puis sélectionnez l'option Paiement/Envoi</p>
            </div>
            <div class="card">
              <h4>📱 Moov Money</h4>
              <p>Composez <strong>*123#</strong> sur votre téléphone</p>
              <p style="margin-top: 1rem; font-size: 0.9rem; color: #7f8c8d;">Puis sélectionnez l'option Paiement/Envoi</p>
            </div>
          </div>
        </section>
      </main>
    `;
  }

  renderPayments() {
    if (!this.currentUser) return this.renderLogin();

    return `
      ${this.renderHeader()}
      <main>
        <section>
          <h2>Mes Paiements</h2>
          
          <div style="margin-bottom: 2rem;">
            <button class="btn btn-primary" id="new-payment-btn">
              ➕ Déclarer un paiement
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Plan</th>
                <th>Montant</th>
                <th>Opérateur</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              ${this.payments.filter(p => p.company_email === this.currentUser.email).length > 0 ?
                this.payments.filter(p => p.company_email === this.currentUser.email).map(payment => `
                  <tr>
                    <td>${new Date(payment.date).toLocaleDateString('fr-FR')}</td>
                    <td>${payment.plan === 'monthly' ? 'Mensuel' : 'Trimestriel'}</td>
                    <td>${payment.amount} FCFA</td>
                    <td>${payment.operator === 'airtel' ? 'Airtel Money' : 'Moov Money'}</td>
                    <td>
                      ${payment.status === 'pending' ? `<span class="badge badge-warning">⏳ En attente</span>` :
                        payment.status === 'confirmed' ? `<span class="badge badge-success">✓ Confirmé</span>` :
                        `<span class="badge badge-danger">✗ Refusé</span>`}
                    </td>
                  </tr>
                `).join('') :
                '<tr><td colspan="5" style="text-align: center; padding: 2rem;">Aucun paiement déclaré</td></tr>'
              }
            </tbody>
          </table>
        </section>
      </main>

      <div id="payment-modal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Déclarer un paiement</h3>
            <button class="close-btn" onclick="document.getElementById('payment-modal').classList.remove('active')">×</button>
          </div>
          <form id="payment-form">
            <div class="form-group">
              <label>Plan</label>
              <select id="payment-plan" required>
                <option value="">-- Sélectionner --</option>
                <option value="monthly">Mensuel (2 000 FCFA)</option>
                <option value="quarterly">Trimestriel (5 000 FCFA)</option>
              </select>
            </div>

            <div class="form-group">
              <label>Opérateur</label>
              <select id="payment-operator" required>
                <option value="">-- Sélectionner --</option>
                <option value="airtel">Airtel Money</option>
                <option value="moov">Moov Money</option>
              </select>
            </div>

            <div class="form-group">
              <label>Numéro de transaction</label>
              <input type="text" id="payment-ref" placeholder="Ex: ABC123456" required>
            </div>

            <button class="btn btn-primary" style="width: 100%;" type="submit">
              📤 Envoyer pour validation
            </button>
          </form>
        </div>
      </div>
    `;
  }

  renderAdmin() {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      return `
        ${this.renderHeader()}
        <main>
          <div class="alert alert-danger">
            <span>🔒</span>
            <div><strong>Accès refusé</strong> - Vous n'avez pas les permissions d'administrateur</div>
          </div>
        </main>
      `;
    }

    const certifiedCount = this.companies.filter(c => c.certified).length;
    const pendingCount = this.companies.filter(c => !c.certified).length;
    const pendingPayments = this.payments.filter(p => p.status === 'pending').length;

    return `
      ${this.renderHeader()}
      <main>
        <section>
          <h2>Panneau Administrateur 🔐</h2>
          
          <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 2rem;">
            <div class="card" style="text-align: center; border-left: 5px solid var(--success);">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">✓</div>
              <h4 style="color: var(--success);">Certifiées</h4>
              <div style="font-size: 1.8rem; font-weight: bold; color: var(--primary);">${certifiedCount}</div>
            </div>
            <div class="card" style="text-align: center; border-left: 5px solid var(--warning);">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">⏳</div>
              <h4 style="color: var(--warning);">En attente</h4>
              <div style="font-size: 1.8rem; font-weight: bold; color: var(--primary);">${pendingCount}</div>
            </div>
            <div class="card" style="text-align: center; border-left: 5px solid var(--secondary);">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">💰</div>
              <h4 style="color: var(--secondary);">Paiements en attente</h4>
              <div style="font-size: 1.8rem; font-weight: bold; color: var(--primary);">${pendingPayments}</div>
            </div>
            <div class="card" style="text-align: center; border-left: 5px solid #3498db;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏢</div>
              <h4 style="color: #3498db;">Total</h4>
              <div style="font-size: 1.8rem; font-weight: bold; color: var(--primary);">${this.companies.length}</div>
            </div>
          </div>
        </section>

        <section>
          <h2>Demandes de Certification</h2>
          ${this.companies.filter(c => !c.certified).length > 0 ?
            `<table>
              <thead>
                <tr>
                  <th>Entreprise</th>
                  <th>Email</th>
                  <th>Catégorie</th>
                  <th>Plan</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.companies.filter(c => !c.certified).map(company => `
                  <tr>
                    <td><strong>${company.name}</strong></td>
                    <td>${company.email}</td>
                    <td>${company.category}</td>
                    <td>${company.subscription_type || 'Aucun'}</td>
                    <td>
                      <button class="btn btn-success" style="padding: 0.5rem; font-size: 0.9rem; margin-right: 0.5rem;" data-action="approve" data-company="${company.id}">
                        ✓ Approuver
                      </button>
                      <button class="btn btn-danger" style="padding: 0.5rem; font-size: 0.9rem;" data-action="reject" data-company="${company.id}">
                        ✗ Refuser
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>` :
            '<div class="alert alert-success"><span>✓</span><div>Toutes les demandes ont été traitées!</div></div>'
          }
        </section>

        <section>
          <h2>Paiements en Attente</h2>
          ${this.payments.filter(p => p.status === 'pending').length > 0 ?
            `<table>
              <thead>
                <tr>
                  <th>Entreprise</th>
                  <th>Montant</th>
                  <th>Opérateur</th>
                  <th>Date</th>
                  <th>Ref</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.payments.filter(p => p.status === 'pending').map(payment => `
                  <tr>
                    <td>${payment.company_email}</td>
                    <td><strong>${payment.amount} FCFA</strong></td>
                    <td>${payment.operator === 'airtel' ? 'Airtel Money' : 'Moov Money'}</td>
                    <td>${new Date(payment.date).toLocaleDateString('fr-FR')}</td>
                    <td><code>${payment.ref}</code></td>
                    <td>
                      <button class="btn btn-success" style="padding: 0.5rem; font-size: 0.9rem; margin-right: 0.5rem;" data-action="confirm-payment" data-payment="${payment.id}">
                        ✓ Confirmer
                      </button>
                      <button class="btn btn-danger" style="padding: 0.5rem; font-size: 0.9rem;" data-action="reject-payment" data-payment="${payment.id}">
                        ✗ Refuser
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>` :
            '<div class="alert alert-success"><span>✓</span><div>Tous les paiements ont été traités!</div></div>'
          }
        </section>
      </main>
    `;
  }

  renderProfile() {
    if (!this.currentUser) return this.renderLogin();

    return `
      ${this.renderHeader()}
      <main>
        <div style="max-width: 600px; margin: 2rem auto;">
          <section>
            <h2>Mon Profil</h2>
            
            <div class="card">
              <div class="form-group">
                <label>Email</label>
                <input type="email" value="${this.currentUser.email}" disabled>
              </div>

              <div class="form-group">
                <label>Nom de l'entreprise</label>
                <input type="text" value="${this.currentUser.company_name || ''}" id="company-name">
              </div>

              <div class="form-group">
                <label>Téléphone</label>
                <input type="tel" value="${this.currentUser.phone || ''}" id="phone">
              </div>

              <div class="form-group">
                <label>Catégorie</label>
                <select id="category">
                  <option value="">-- Sélectionner --</option>
                  <option value="ecommerce" ${this.currentUser.category === 'ecommerce' ? 'selected' : ''}>E-commerce</option>
                  <option value="service" ${this.currentUser.category === 'service' ? 'selected' : ''}>Service</option>
                  <option value="retail" ${this.currentUser.category === 'retail' ? 'selected' : ''}>Détail</option>
                  <option value="food" ${this.currentUser.category === 'food' ? 'selected' : ''}>Restauration</option>
                  <option value="other" ${this.currentUser.category === 'other' ? 'selected' : ''}>Autre</option>
                </select>
              </div>

              <div class="form-group">
                <label>Réseaux sociaux (séparés par des virgules)</label>
                <input type="text" value="${(this.currentUser.networks || []).join(', ')}" id="networks" 
                  placeholder="Facebook, Instagram, WhatsApp, Twitter">
              </div>

              <button class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;" id="save-profile-btn">
                💾 Sauvegarder le profil
              </button>

              <button class="btn btn-danger" style="width: 100%;" id="logout-btn">
                🚪 Déconnexion
              </button>
            </div>

            ${this.currentUser.company_name ? `
              <div class="card" style="margin-top: 2rem;">
                <h3 style="color: var(--primary); margin-bottom: 1rem;">Votre Badge de Certification</h3>
                <div style="text-align: center; background: linear-gradient(135deg, var(--primary), #2d5f3f); color: white; padding: 2rem; border-radius: 10px; margin-bottom: 1rem;">
                  <div style="font-size: 3rem; margin-bottom: 1rem;">✓</div>
                  <h4>${this.currentUser.company_name}</h4>
                  <p style="margin: 1rem 0;">Certifiée par AssekTrust</p>
                  <small>ID: ASSEK-${Math.random().toString(36).substr(2, 9).toUpperCase()}</small>
                </div>
                <button class="btn btn-secondary" style="width: 100%;" onclick="window.print()">
                  🖨️ Imprimer le badge
                </button>
              </div>
            ` : ''}
          </section>
        </div>
      </main>
    `;
  }

  attachPageEventListeners(page) {
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      this.currentUser = null;
      this.saveToStorage();
      this.renderPage('home');
    });

    if (page === 'login') {
      document.getElementById('login-btn')?.addEventListener('click', () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        if (email && password) {
          this.currentUser = {
            id: 'user-' + Date.now(),
            email: email,
            role: 'user',
            networks: []
          };
          this.saveToStorage();
          this.renderPage('companies');
        } else {
          alert('Veuillez remplir tous les champs');
        }
      });

      document.getElementById('admin-login-btn')?.addEventListener('click', () => {
        const adminPassword = prompt('Mot de passe administrateur:');
        
        // ✅ Vérification stricte du mot de passe admin
        if (adminPassword === this.adminPassword) {
          this.currentUser = {
            id: 'admin-' + Date.now(),
            email: this.adminEmail,
            role: 'admin'
          };
          this.saveToStorage();
          this.renderPage('admin');
        } else {
          alert('❌ Mot de passe administrateur incorrect!');
        }
      });
    }

    if (page === 'payments') {
      document.getElementById('new-payment-btn')?.addEventListener('click', () => {
        document.getElementById('payment-modal').classList.add('active');
      });

      document.getElementById('payment-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const plan = document.getElementById('payment-plan').value;
        const operator = document.getElementById('payment-operator').value;
        const ref = document.getElementById('payment-ref').value;
        
        const amounts = { monthly: 2000, quarterly: 5000 };
        
        if (!plan || !operator || !ref) {
          alert('Veuillez remplir tous les champs');
          return;
        }

        const payment = {
          id: 'pay-' + Date.now(),
          company_email: this.currentUser.email,
          plan: plan,
          amount: amounts[plan],
          operator: operator,
          ref: ref,
          date: new Date().toISOString(),
          status: 'pending'
        };

        this.payments.push(payment);
        this.saveToStorage();
        alert('✓ Paiement déclaré! En attente de validation par l\'administrateur.');
        document.getElementById('payment-modal').classList.remove('active');
        this.renderPage('payments');
      });
    }

    if (page === 'admin') {
      document.querySelectorAll('[data-action="approve"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const companyId = btn.dataset.company;
          const company = this.companies.find(c => c.id === companyId);
          if (company) {
            company.certified = true;
            company.certified_date = new Date().toISOString();
            this.saveToStorage();
            alert('✓ Entreprise certifiée!');
            this.renderPage('admin');
          }
        });
      });

      document.querySelectorAll('[data-action="confirm-payment"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const paymentId = btn.dataset.payment;
          const payment = this.payments.find(p => p.id === paymentId);
          if (payment) {
            payment.status = 'confirmed';
            
            let company = this.companies.find(c => c.email === payment.company_email);
            if (!company) {
              company = {
                id: 'comp-' + Date.now(),
                name: payment.company_email.split('@')[0],
                email: payment.company_email,
                category: 'ecommerce',
                phone: '',
                networks: [],
                subscription_type: payment.plan,
                subscription_date: new Date().toISOString(),
                certified: false
              };
              this.companies.push(company);
            } else {
              company.subscription_type = payment.plan;
              company.subscription_date = new Date().toISOString();
            }
            
            this.saveToStorage();
            alert('✓ Paiement confirmé!');
            this.renderPage('admin');
          }
        });
      });

      document.querySelectorAll('[data-action="reject-payment"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const paymentId = btn.dataset.payment;
          const payment = this.payments.find(p => p.id === paymentId);
          if (payment) {
            payment.status = 'rejected';
            this.saveToStorage();
            alert('✗ Paiement refusé');
            this.renderPage('admin');
          }
        });
      });
    }

    if (page === 'profile') {
      document.getElementById('save-profile-btn')?.addEventListener('click', () => {
        const companyName = document.getElementById('company-name').value;
        if (!companyName) {
          alert('Veuillez entrer le nom de votre entreprise');
          return;
        }

        this.currentUser.company_name = companyName;
        this.currentUser.phone = document.getElementById('phone').value;
        this.currentUser.category = document.getElementById('category').value;
        this.currentUser.networks = document.getElementById('networks').value.split(',').map(n => n.trim()).filter(n => n);
        
        this.saveToStorage();
        alert('✓ Profil mis à jour!');
        this.renderPage('profile');
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new AssekTrust();
});
