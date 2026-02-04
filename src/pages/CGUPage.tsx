// src/pages/CGUPage.tsx

import { Box, Container, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

const CGUPage = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F9FAFB', py: 4 }}>
            <Container maxWidth="md">
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <ArrowBack
                        sx={{ cursor: 'pointer', color: '#6B7280' }}
                        onClick={() => navigate(-1)}
                    />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Conditions Générales d'Utilisation
                    </Typography>
                </Box>

                <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 4, display: 'block' }}>
                        Dernière mise à jour : 4 février 2026
                    </Typography>

                    {/* Article 1 */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
                        Article 1 – Objet
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») ont pour objet de définir
                        les modalités et conditions d'utilisation de la plateforme SecondLife Exchange (ci-après « la Plateforme »).
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        SecondLife Exchange est une plateforme d'échange d'objets entre particuliers, sans transaction monétaire,
                        dans une démarche d'économie circulaire et de développement durable.
                    </Typography>

                    {/* Article 2 */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
                        Article 2 – Mentions légales
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.8 }}>
                        <strong>Éditeur de la Plateforme :</strong><br />
                        Association SecondLife<br />
                        Email : contact@secondlifeexchange.com
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        <strong>Hébergeur :</strong><br />
                        Google Cloud Platform<br />
                        Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irlande
                    </Typography>

                    {/* Article 3 */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
                        Article 3 – Définitions
                    </Typography>
                    <Typography variant="body1" component="div" sx={{ mb: 2, lineHeight: 1.8 }}>
                        <ul style={{ paddingLeft: 20, margin: 0 }}>
                            <li><strong>Utilisateur</strong> : toute personne physique inscrite sur la Plateforme</li>
                            <li><strong>Objet</strong> : tout bien matériel proposé à l'échange sur la Plateforme</li>
                            <li><strong>Échange</strong> : transaction non monétaire entre deux Utilisateurs portant sur un ou plusieurs Objets</li>
                            <li><strong>Compte</strong> : espace personnel de l'Utilisateur sur la Plateforme</li>
                            <li><strong>Contenu</strong> : photos, descriptions, messages et toute information publiée par l'Utilisateur</li>
                        </ul>
                    </Typography>

                    {/* Article 4 */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
                        Article 4 – Acceptation des CGU
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        L'inscription et l'utilisation de la Plateforme impliquent l'acceptation pleine et entière des présentes CGU.
                        L'Utilisateur reconnaît avoir pris connaissance des CGU et s'engage à les respecter.
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        SecondLife Exchange se réserve le droit de modifier les CGU à tout moment. Les Utilisateurs seront informés
                        de toute modification par notification sur la Plateforme.
                    </Typography>

                    {/* Article 5 */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
                        Article 5 – Inscription et Compte Utilisateur
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        <strong>5.1 Conditions d'inscription</strong><br />
                        Pour s'inscrire, l'Utilisateur doit être une personne physique majeure (18 ans minimum),
                        fournir des informations exactes et complètes, disposer d'une adresse email valide,
                        et accepter les présentes CGU ainsi que la Politique de Confidentialité.
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        <strong>5.2 Responsabilité de l'Utilisateur</strong><br />
                        L'Utilisateur est seul responsable de la confidentialité de ses identifiants de connexion,
                        de toute activité effectuée depuis son Compte, et de la véracité des informations fournies.
                    </Typography>

                    {/* Article 6 */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
                        Article 6 – Utilisation de la Plateforme
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        <strong>6.1 Publication d'Objets</strong><br />
                        L'Utilisateur peut proposer des Objets à l'échange en respectant les conditions suivantes :
                        l'Objet doit lui appartenir, la description doit être exacte et non trompeuse,
                        les photos doivent représenter fidèlement l'Objet, et l'état doit être clairement indiqué.
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        <strong>6.2 Objets interdits</strong><br />
                        Sont strictement interdits sur la Plateforme : les objets volés ou contrefaits, les armes et munitions,
                        les substances illicites ou dangereuses, les médicaments, les animaux vivants,
                        les produits alimentaires périssables, et tout objet dont l'échange est interdit par la loi.
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        <strong>6.3 Échanges entre Utilisateurs</strong><br />
                        Les échanges s'effectuent directement entre Utilisateurs. SecondLife Exchange n'est pas partie aux
                        transactions et ne peut être tenue responsable de la qualité des Objets échangés ou de l'exécution des échanges.
                    </Typography>

                    {/* Article 7 */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
                        Article 7 – Propriété intellectuelle
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        L'ensemble des éléments de la Plateforme (design, logo, textes, fonctionnalités) sont la propriété
                        exclusive de SecondLife Exchange et sont protégés par les lois relatives à la propriété intellectuelle.
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        L'Utilisateur conserve la propriété de son Contenu. En publiant sur la Plateforme, il accorde à
                        SecondLife Exchange une licence non exclusive et gratuite pour utiliser ce Contenu dans le cadre
                        du fonctionnement de la Plateforme.
                    </Typography>

                    {/* Article 8 */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
                        Article 8 – Responsabilités
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        SecondLife Exchange s'engage à assurer le bon fonctionnement de la Plateforme dans la limite de ses
                        moyens techniques. Elle ne peut être tenue responsable des interruptions temporaires pour maintenance,
                        des problèmes de connexion indépendants de sa volonté, du Contenu publié par les Utilisateurs,
                        ou des échanges réalisés entre Utilisateurs.
                    </Typography>

                    {/* Article 9 */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
                        Article 9 – Modération et sanctions
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        SecondLife Exchange se réserve le droit de supprimer tout Contenu contraire aux CGU ou à la loi,
                        de suspendre ou supprimer un Compte en cas de manquement grave ou répété, et de signaler aux autorités
                        compétentes tout comportement illicite.
                    </Typography>

                    {/* Article 10 */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
                        Article 10 – Données personnelles
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        La collecte et le traitement des données personnelles sont régis par la Politique de Confidentialité,
                        disponible sur la Plateforme et constituant partie intégrante des présentes CGU.
                    </Typography>

                    {/* Article 11 */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
                        Article 11 – Résiliation
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        L'Utilisateur peut supprimer son Compte à tout moment depuis les paramètres de son profil.
                        SecondLife Exchange peut résilier le Compte d'un Utilisateur en cas de violation des CGU,
                        d'inactivité prolongée (24 mois), ou de comportement portant atteinte à la communauté.
                    </Typography>

                    {/* Article 12 */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
                        Article 12 – Droit applicable
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        Les présentes CGU sont soumises au droit français. En cas de litige, une solution amiable sera
                        recherchée avant toute action judiciaire. À défaut d'accord, les tribunaux français seront seuls compétents.
                    </Typography>

                    {/* Article 13 */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
                        Article 13 – Contact
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        Pour toute question relative aux présentes CGU : contact@secondlifeexchange.com
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default CGUPage;