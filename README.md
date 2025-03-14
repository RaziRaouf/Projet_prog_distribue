# Projet de Gestion Civique  

**Microservices Kubernetes avec Spring Boot, PostgreSQL, Docker et Sécurité Avancée**  

---

## 📋 Table des matières  
- [Aperçu](#aperçu)  
- [Architecture Technique](#architecture-technique)  
- [Fonctionnalités](#fonctionnalités)  
- [Installation](#installation)  
- [Configuration](#configuration)  
- [Base de Données PostgreSQL](#base-de-données-postgresql)  
- [Ingress Gateway](#ingress-gateway)  
- [Sécurisation Avancée](#sécurisation-avancée)  
- [Dockerisation](#dockerisation)  
- [Commandes Utiles](#commandes-utiles)  
- [Dépannage](#dépannage)  
- [Références](#références)  

---

## 🌟 Aperçu  
Ce projet déploie un **système de gestion civique** avec des **microservices** pour la gestion des citoyens et des événements civils (mariages, naissances, divorces) dans un environnement **Kubernetes** sécurisé.

### **Services principaux** :  
- 🧑💻 **Citizen Service** : Gestion CRUD des citoyens (Spring Boot + PostgreSQL).  
- 📅 **Civil Events Service** : Gestion des événements civils (Feign Client pour la communication inter-services).  
- 🔒 **Sécurité** : RBAC, TLS, Network Policies, Secrets chiffrés.  

---

## 🏗 Architecture Technique  

```plaintext
                          +---------------------+
                          |   Ingress (Nginx)   |
                          |  - TLS/HTTPS        |
                          |  - WAF              |
                          +----------+----------+
                                     |
                                     v
+----------------+        +----------+----------+        +-------------------+
|   Citizen      | HTTP   |   Civil Events     | HTTP   |   PostgreSQL      |
|   Service      <--------+   Service          <--------+   (ClusterIP)     |
|   (NodePort)   |        |   (ClusterIP)      |  JDBC  |                   |
+----------------+        +--------------------+        +-------------------+
```

### **Composants clés** :  
- **Citizen Service** : API REST sur le port 8081 (/citizens/*).  
- **Civil Events Service** : Routes /marriages, /births, /divorces (port 8080).  
- **PostgreSQL** : Base de données avec migrations Hibernate.  
- **Ingress** : Routage TLS avec annotations de sécurité.  

---

## 🚀 Fonctionnalités  

### **Métier**  

| Service        | Endpoints                 | Description                         |
|---------------|---------------------------|-------------------------------------|
| **Citizen**    | GET /citizens              | Liste tous les citoyens             |
|               | POST /citizens             | Crée un nouveau citoyen             |
|               | PUT /citizens/{id}         | Met à jour un citoyen               |
| **Civil Events**| POST /marriages          | Enregistre un mariage               |
|               | POST /divorces             | Gère un divorce                     |
|               | POST /births               | Enregistre une naissance            |

---

## 🔧 Installation  

### **Prérequis**  
- Minikube v1.25+  
- kubectl v1.24+  
- Helm v3.8+  

### **Étapes** :  

1. **Démarrer Minikube** :  
    ```bash
    minikube start --driver=docker --memory=4096  
    minikube addons enable ingress  
    ```

2. **Déployer les composants** :  
    ```bash
    kubectl apply -f postgres-deployment.yaml  
    kubectl apply -f citizen-deployment.yaml  
    kubectl apply -f civil-events-deployment.yaml  
    ```

3. **Activer l'Ingress** :  
    ```bash
    kubectl apply -f ingress.yaml  
    ```

---

## 🗄 Base de Données PostgreSQL  
- Stocke toutes les données des citoyens et événements.  
- Déploiement avec **StatefulSet** pour la persistance.  
- Sauvegarde et chiffrement des **credentials** avec **Kubernetes Secrets**.  

**Exemple de Secret PostgreSQL** :  
```yaml
data:
  POSTGRES_USER: "<base64>"
  POSTGRES_PASSWORD: "<base64>"
```

---

## 🌐 Ingress Gateway  

L'**Ingress Controller** (Nginx) sécurise l'accès aux services et applique TLS :  
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-citizen-service
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: citizens.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: citizen-service
            port:
              number: 8081
```

---

## 🔐 Sécurisation Avancée  

| Composant       | Outil/Technologie         | Description                         |
|-----------------|---------------------------|-------------------------------------|
| **Authentification** | RBAC                      | Rôles restrictifs par service      |
| **Chiffrement**      | Secrets Kubernetes         | Stockage sécurisé des credentials PostgreSQL |
| **Réseau**           | Network Policies           | Isolation de PostgreSQL            |
| **TLS**              | Cert-Manager + Let's Encrypt | Certificats auto-renouvelés       |

---

## 📦 Dockerisation  

Chaque service est conteneurisé avec Docker :  

**Exemple de Dockerfile** :  
```dockerfile
FROM openjdk:17
COPY target/citizen-service.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Build & Push** :  
```bash
docker build -t myrepo/citizen-service .
docker push myrepo/citizen-service
```

---

## 🔍 Commandes Utiles  

- **Lister les pods** :  
    ```bash
    kubectl get pods
    ```
- **Vérifier les logs d'un service** :  
    ```bash
    kubectl logs -f deployment/civil-events-service
    ```
- **Redémarrer un déploiement** :  
    ```bash
    kubectl rollout restart deployment/citizen-deployment
    ```

---

## 🚨 Dépannage  

| Symptôme                      | Solution                               |
|--------------------------------|----------------------------------------|
| **Erreur 503 sur l'Ingress**   | Vérifier les endpoints : `kubectl get endpoints` |
| **PostgreSQL inaccessible**    | Vérifier les Network Policies         |
| **Certificats non générés**    | Inspecter Cert-Manager : `kubectl describe clusterissuer` |

---

## 📚 Références  
- [Documentation Kubernetes](https://kubernetes.io/docs/)  
- [Best Practices Sécurité](https://kubernetes.io/docs/best-practices/)  
- [Cert-Manager](https://cert-manager.io/docs/)  

---

**Contact** : mohamedraoufrazi@gmail.com | [Repo GitHub](https://github.com/RaziRaouf/Projet_prog_distribue)
