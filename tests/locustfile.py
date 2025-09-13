from locust import HttpUser, task, between

# class HelloWorldUser(HttpUser):
#     @task
#     def sailingloc(self):
#         self.client.get("/api/v1")
#         self.client.get("/api/v1/users")
#         self.client.get("/api/v1/boats")
#         self.client.get("/api/v1/reservations")
#         self.client.get("/api/v1/ports")
#         self.client.get("/api/v1/users-documents")


class SailingLocUser(HttpUser):
    wait_time = between(1, 3)  # pause entre les requêtes

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

    @task(2)
    def get_boats(self):
        self.client.get("/api/v1/boats", headers=self.headers)

    @task(1)
    def get_ports(self):
        self.client.get("/api/v1/ports", headers=self.headers)

    @task(1)
    def get_boat_types(self):
        self.client.get("/api/v1/boat-types", headers=self.headers)

    @task(1)
    def get_user_profile(self):
        self.client.get("/api/v1/users", headers=self.headers)

    @task(1)
    def get_contracts(self):
        self.client.get("/api/v1/contracts", headers=self.headers)

    @task(1)
    def get_reservations(self):
        self.client.get("/api/v1/reservations", headers=self.headers)

    @task(1)
    def get_reviews(self):
        self.client.get("/api/v1/reviews", headers=self.headers)

    @task(1)
    def get_availabilities(self):
        self.client.get("/api/v1/availabilities", headers=self.headers)

    @task(1)
    def get_messages(self):
        self.client.get("/api/v1/messages", headers=self.headers)

    @task(1)
    def get_boat_equipments(self):
        self.client.get("/api/v1/boat-equipments", headers=self.headers)

    @task(1)
    def get_boat_photos(self):
        self.client.get("/api/v1/boat-photos", headers=self.headers)

    @task(1)
    def get_user_documents(self):
        self.client.get("/api/v1/users-documents", headers=self.headers)

    @task
    def get_users(self):
        self.client.get("/api/v1/users", headers=self.headers)