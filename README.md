# Projet de Gestion Civique  
*Microservices Kubernetes avec Spring Boot, PostgreSQL et Sécurité Avancée*  

---

## 📋 Table des matières  
- [Aperçu](#aperçu)  
- [Architecture Technique](#architecture-technique)  
- [Fonctionnalités](#fonctionnalités)  
- [Installation](#installation)  
- [Configuration](#configuration)  
- [Sécurité](#sécurité)  
- [Commandes Utiles](#commandes-utiles)  
- [Dépannage](#dépannage)  

---

## 🌟 Aperçu  
Ce projet déploie deux microservices interconnectés pour la gestion des citoyens et des événements civils (mariages, naissances, divorces) sur Kubernetes.  

**Services principaux** :  
- 🧑💻 **Citizen Service** : Gestion CRUD des citoyens (Spring Boot + PostgreSQL).  
- 📅 **Civil Events Service** : Orchestration des événements civils avec communication inter-services (Feign Client).  
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
### Composants clés :
- **Citizen Service** : API REST sur le port 8081 (/citizens/*).
- **Civil Events Service** : Routes /marriages, /births, /divorces (port 8080).
- **PostgreSQL** : Base de données avec migrations Hibernate.
- **Ingress** : Routage TLS avec annotations de sécurité.


## 🚀 Fonctionnalités

### Métier

| Service        | Endpoints                 | Description                         |
|----------------|---------------------------|-------------------------------------|
| **Citizen**    | GET /citizens              | Liste tous les citoyens             |
|                | POST /citizens             | Crée un nouveau citoyen             |
|                | PUT /citizens/{id}         | Met à jour un citoyen               |
| **Civil Events**| POST /marriages            | Enregistre un mariage               |
|                | POST /divorces             | Gère un divorce                     |
|                | POST /births               | Enregistre une naissance            |

### Technique

- 🔄 **Communication inter-services** via Feign Client.
- 📊 **Base de données PostgreSQL** avec chiffrement ETCD.
- 🔐 **Sécurité** : RBAC et Network Policies.


## 🔧 Installation

### Prérequis
- Minikube v1.25+
- kubectl v1.24+
- Helm v3.8+

### Étapes :

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

3. **Appliquer la sécurité** :
    ```bash
    kubectl apply -f k8s-security/secrets/  
    kubectl apply -f k8s-security/network-policies/  
    ```

4. **Activer l'Ingress** :
    ```bash
    kubectl apply -f citizen-ingress-secure.yaml  
    ```

## ⚙ Configuration

### Fichiers critiques :

- **Secrets PostgreSQL** (k8s-security/secrets/postgres-secret.yaml) :
    ```yaml
    data:  
      POSTGRES_USER: "<base64>"  
      POSTGRES_PASSWORD: "<base64>"
    ```

- **RBAC** (k8s-security/rbac/citizen-role.yaml) :
    ```yaml
    - apiGroups: [""]  
      resources: ["pods", "services"]  
      verbs: ["get", "list"]
    ```

- **Network Policy** (k8s-security/network-policies/postgres-policy.yaml) :
    ```yaml
    - from:  
      - podSelector:  
          matchLabels:  
            app: citizen
    ```

---

## 🔐 Sécurité

### Mesures implémentées :

| Composant       | Outil/Technologie         | Description                         |
|-----------------|---------------------------|-------------------------------------|
| **Authentification** | RBAC                      | Rôles restrictifs par service      |
| **Chiffrement**      | Secrets Kubernetes         | Stockage sécurisé des credentials PostgreSQL |
| **Réseau**           | Network Policies           | Isolation de PostgreSQL            |
| **TLS**              | Cert-Manager + Let's Encrypt | Certificats auto-renouvelés       |

---

## 🛠 Commandes utiles

### Gestion du cluster :
- Vérifier les certificats TLS :
    ```bash
    kubectl get certificates  
    ```

- Accéder aux logs d'un service :
    ```bash
    kubectl logs -f deployment/civil-events-service  
    ```

- Redémarrer un déploiement :
    ```bash
    kubectl rollout restart deployment/citizen-deployment  
    ```

### Sécurité :
- Générer un secret PostgreSQL :
    ```bash
    kubectl create secret generic postgres-secrets \  
      --from-literal=POSTGRES_USER=admin \  
      --from-literal=POSTGRES_PASSWORD=$(openssl rand -base64 16)  
    ```

---

## 🚨 Dépannage

### Problèmes courants :

| Symptôme                      | Solution                               |
|-------------------------------|----------------------------------------|
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

