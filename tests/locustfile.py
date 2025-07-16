from locust import HttpUser, task

class HelloWorldUser(HttpUser):
    @task
    def hello_world(self):
        self.client.get("/api/v1")
        self.client.get("/api/v1/users")
        self.client.get("/api/v1/boats")
        self.client.get("/api/v1/reservations")
        self.client.get("/api/v1/ports")
        self.client.get("/api/v1/users-documents")