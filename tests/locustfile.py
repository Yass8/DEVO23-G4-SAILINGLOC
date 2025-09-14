from locust import HttpUser, task, between
import random
class SailingLocUser(HttpUser):
    wait_time = between(1, 3)



class VisiteurAnonyme(SailingLocUser):

    # Scénario 1: Parcours Visiteur Anonyme
    # Simule le comportement d'un utilisateur non connecté qui navigue sur le site.
    # C'est typiquement la majorité du trafic.

    weight = 3  # Plus de visiteurs que d'autres types d'utilisateurs
    
    @task(7)
    def consulter_liste_ports(self):
        self.client.get("/api/v1/ports")
    @task(5)
    def consulter_types_bateaux(self):
        self.client.get("/api/v1/boat-types")
    @task(8)
    def consulter_liste_bateaux(self):
        # Consultation de la liste des bateaux (peut inclure des filtres simples)
        self.client.get("/api/v1/boats")
    @task(4)
    def rechercher_bateaux_avec_filtres(self):
        # Simulation d'une recherche avec quelques paramètres
        params = {
            "capacity": random.randint(2, 20)
        }
        self.client.get("/api/v1/boats", params=params, name="/api/v1/boats [SEARCH]")

class Locataire(SailingLocUser):
    
    # Scénario 2: Parcours Locataire Authentifié
    # Simule un utilisateur connecté qui cherche, réserve et paye un bateau.
    # C'est le scénario le plus critique pour le business.
    
    weight = 2

    def on_start(self):
        # Authentification initiale pour récupérer le token
        response = self.client.post("/api/v1/auth/login", json={
            "email": "aliyassir131@outlook.fr",
            "password": "Aa_123"
        })

        # Récupérer le token depuis la réponse
        self.token = response.json().get("token")  # adapte selon ta structure

        # Préparer les headers pour les prochaines requêtes
        self.headers = {
            "Authorization": f"{self.token}"
        } 
    
    # self.boat_ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]


    @task(5)
    def naviguer_apres_connexion(self):
        # Actions de navigation une fois connecté
        self.client.get("/api/v1/boats", headers=self.headers)
        self.client.get("/api/v1/users", headers=self.headers)

    @task(3)
    def consulter_ses_reservations(self):
        self.client.get("/api/v1/reservations", headers=self.headers)

    @task(1)
    def effectuer_une_reservation(self):
        # """
        # Tâche complexe : Création d'une réservation et simulation de paiement.
        # Cette tâche est moins fréquente (poids 1) mais très importante.
        # """
        # 1. Préparation de la réservation
        # boat_id = random.choice(self.boat_ids)
        boat_id = 1
        payload = {
            "boat_id": boat_id,
            "boat_id": 1,
            "start_date": "2024-07-15",
            "end_date": "2024-07-20",
            "total_price": 845,
        }
        # 2. Création de la réservation
        with self.client.post("/api/v1/reservations/new", json=payload, headers=self.headers, catch_response=True) as response:
            if response.status in [200, 201]:
                response.success()
            else:
                response.failure(f"Erreur création réservation: {response.status}")

    # Méthode pour simuler un paiement (à compléter avec les bonnes routes)
    def simuler_paiement(self, reservation_id):
        payment_payload = {
            "reservation_id": reservation_id,
            "amount": 500.00,
            "method": "credit_card",
            "commission_amount": 50
        }
        self.client.post("/api/v1/payments", json=payment_payload, headers=self.headers, name="/api/v1/payments [CREATE]")

class Proprietaire(SailingLocUser):
    # """
    # Scénario 3: Parcours Propriétaire
    # Simule un propriétaire de bateau qui gère ses annonces et ses disponibilités.
    # """
    weight = 1
    def on_start(self):
        # Authentification initiale pour récupérer le token
        response = self.client.post("/api/v1/auth/login", json={
            "email": "aliyassir131@outlook.fr",
            "password": "Aa_123"
        })

        # Récupérer le token depuis la réponse
        self.token = response.json().get("token")  # adapte selon ta structure

        # Préparer les headers pour les prochaines requêtes
        self.headers = {
            "Authorization": f"{self.token}"
        }
        # self.my_boat_ids = [101, 102]

    @task(4)
    def consulter_ses_bateaux(self):
        self.client.get("/api/v1/boats",  headers=self.headers)
    @task(3)
    def gerer_ses_documents(self):
        self.client.get("/api/v1/users-documents",  headers=self.headers)
    @task(2)
    def consulter_ses_contrats(self):
        self.client.get("/api/v1/contracts",  headers=self.headers)
    @task(1)
    def ajouter_une_disponibilite(self):
        # """Ajoute une période de disponibilité pour un de ses bateaux."""
        # boat_id = random.choice(self.my_boat_ids)
        payload = {
            "boat_id": 3,
            "start_date": "2024-08-01",
            "end_date": "2024-08-10",
            "status": "available"
        }
        self.client.post("/api/v1/availabilities", json=payload,  headers=self.headers)
