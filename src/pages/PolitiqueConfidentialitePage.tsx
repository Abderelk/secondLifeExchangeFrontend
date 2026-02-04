// src/pages/PolitiqueConfidentialitePage.tsx

import { Box, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

const PolitiqueConfidentialitePage = () => {
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
                        Politique de Confidentialité
                    </Typography>
                </Box>

                <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 4, display: 'block' }}>
                        Dernière mise à jour : 4 février 2026
                    </Typography>

                    {/* Introduction */}
                    <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                        SecondLife Exchange s'engage à protéger la vie privée de ses utilisateurs. La présente Politique
                        de Confidentialité décrit comment nous collectons, utilisons, stockons et protégeons vos données
                        personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi
                        Informatique et Libertés.
                    </Typography>

                    {/* Section 1 */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
                        1. Responsable du traitement
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        Association SecondLife<br />
                        Email : dpo@secondlifeexchange.com
                    </Typography>

                    {/* Section 2 */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
                        2. Données collectées
                    </Typography>

                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                        2.1 Données fournies par l'utilisateur
                    </Typography>
                    <TableContainer sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#F3F4F6' }}>
                                    <TableCell sx={{ fontWeight: 600 }}>Donnée</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Finalité</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Base légale</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Prénom, nom</TableCell>
                                    <TableCell>Identification</TableCell>
                                    <TableCell>Exécution du contrat</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Adresse email</TableCell>
                                    <TableCell>Authentification, communication</TableCell>
                                    <TableCell>Exécution du contrat</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Mot de passe (hashé)</TableCell>
                                    <TableCell>Sécurité du compte</TableCell>
                                    <TableCell>Exécution du contrat</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Ville, code postal</TableCell>
                                    <TableCell>Faciliter les échanges locaux</TableCell>
                                    <TableCell>Exécution du contrat</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Photos d'objets</TableCell>
                                    <TableCell>Publication d'annonces</TableCell>
                                    <TableCell>Exécution du contrat</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Messages</TableCell>
                                    <TableCell>Communication entre utilisateurs</TableCell>
                                    <TableCell>Exécution du contrat</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                        2.2 Données collectées automatiquement
                    </Typography>
                    <TableContainer sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#F3F4F6' }}>
                                    <TableCell sx={{ fontWeight: 600 }}>Donnée</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Finalité</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Base légale</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Adresse IP</TableCell>
                                    <TableCell>Sécurité, prévention des fraudes</TableCell>
                                    <TableCell>Intérêt légitime</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Données de navigation</TableCell>
                                    <TableCell>Amélioration du service</TableCell>
                                    <TableCell>Intérêt légitime</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Horodatage des actions</TableCell>
                                    <TableCell>Historique, sécurité</TableCell>
                                    <TableCell>Exécution du contrat</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                        2.3 Données que nous ne collectons PAS
                    </Typography>
                    <Typography variant="body1" component="div" sx={{ mb: 2, lineHeight: 1.8 }}>
                        <ul style={{ paddingLeft: 20, margin: 0 }}>
                            <li>Données bancaires (aucune transaction monétaire)</li>
                            <li>Numéro de sécurité sociale</li>
                            <li>Données de santé</li>
                            <li>Opinions politiques ou religieuses</li>
                            <li>Géolocalisation précise en temps réel</li>
                        </ul>
                    </Typography>

                    {/* Section 3 */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
                        3. Finalités du traitement
                    </Typography>
                    <Typography variant="body1" component="div" sx={{ mb: 2, lineHeight: 1.8 }}>
                        Vos données sont utilisées pour :
                        <ol style={{ paddingLeft: 20, margin: '8px 0' }}>
                            <li><strong>Gestion de votre compte</strong> : création, authentification, personnalisation</li>
                            <li><strong>Fonctionnement de la Plateforme</strong> : publication d'objets, échanges, messagerie</li>
                            <li><strong>Communication</strong> : notifications, alertes, réponses à vos demandes</li>
                            <li><strong>Amélioration du service</strong> : analyse d'usage anonymisée, correction de bugs</li>
                            <li><strong>Sécurité</strong> : prévention des fraudes, protection contre les abus</li>
                            <li><strong>Obligations légales</strong> : réponse aux réquisitions judiciaires</li>
                        </ol>
                    </Typography>

                    {/* Section 4 */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
                        4. Destinataires des données
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        <strong>Sous-traitants :</strong>
                    </Typography>
                    <TableContainer sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#F3F4F6' }}>
                                    <TableCell sx={{ fontWeight: 600 }}>Prestataire</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Localisation</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Google Cloud Platform</TableCell>
                                    <TableCell>Hébergement</TableCell>
                                    <TableCell>UE (Belgique)</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>MongoDB Atlas</TableCell>
                                    <TableCell>Base de données</TableCell>
                                    <TableCell>UE</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Google (Gemini API)</TableCell>
                                    <TableCell>Suggestions IA</TableCell>
                                    <TableCell>UE/US</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, fontWeight: 600, color: '#22C55E' }}>
                        Nous ne vendons jamais vos données à des tiers.
                    </Typography>

                    {/* Section 5 */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
                        5. Durée de conservation
                    </Typography>
                    <TableContainer sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#F3F4F6' }}>
                                    <TableCell sx={{ fontWeight: 600 }}>Données</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Durée de conservation</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Compte actif</TableCell>
                                    <TableCell>Durée de l'inscription</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Compte supprimé</TableCell>
                                    <TableCell>Suppression immédiate</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Logs de connexion</TableCell>
                                    <TableCell>12 mois</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Messages (après suppression)</TableCell>
                                    <TableCell>Anonymisés</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Section 6 */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
                        6. Vos droits (RGPD)
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        Conformément au RGPD, vous disposez des droits suivants :
                    </Typography>
                    <Typography variant="body1" component="div" sx={{ mb: 2, lineHeight: 1.8 }}>
                        <ul style={{ paddingLeft: 20, margin: 0 }}>
                            <li><strong>Droit d'accès (Art. 15)</strong> : obtenir une copie de vos données personnelles</li>
                            <li><strong>Droit de rectification (Art. 16)</strong> : modifier vos informations à tout moment</li>
                            <li><strong>Droit à l'effacement (Art. 17)</strong> : supprimer votre compte et vos données</li>
                            <li><strong>Droit à la portabilité (Art. 20)</strong> : exporter vos données en format JSON</li>
                            <li><strong>Droit d'opposition (Art. 21)</strong> : vous opposer au traitement de vos données</li>
                            <li><strong>Droit de retirer votre consentement</strong> : à tout moment</li>
                        </ul>
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        <strong>Pour exercer vos droits :</strong><br />
                        • En ligne : Paramètres de votre compte<br />
                        • Par email : dpo@secondlifeexchange.com
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        <strong>Réclamation :</strong> Vous pouvez introduire une réclamation auprès de la CNIL (www.cnil.fr)
                    </Typography>

                    {/* Section 7 */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
                        7. Sécurité des données
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        Nous mettons en œuvre des mesures techniques et organisationnelles appropriées :
                    </Typography>
                    <Typography variant="body1" component="div" sx={{ mb: 2, lineHeight: 1.8 }}>
                        <ul style={{ paddingLeft: 20, margin: 0 }}>
                            <li><strong>Chiffrement</strong> : HTTPS/TLS pour toutes les communications</li>
                            <li><strong>Hashage</strong> : mots de passe hashés avec bcrypt</li>
                            <li><strong>Authentification</strong> : tokens JWT avec expiration courte</li>
                            <li><strong>Stockage</strong> : données hébergées dans des datacenters sécurisés en UE</li>
                            <li><strong>Accès limité</strong> : seules les personnes habilitées accèdent aux données</li>
                        </ul>
                    </Typography>

                    {/* Section 8 */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
                        8. Cookies
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        Notre site utilise des cookies essentiels pour son fonctionnement (authentification, sécurité).
                        Les cookies optionnels (analytiques) ne sont activés qu'avec votre consentement.
                        Vous pouvez gérer vos préférences dans les paramètres de votre compte.
                    </Typography>

                    {/* Section 9 */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
                        9. Intelligence Artificielle
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                        Notre fonctionnalité de suggestions utilise l'API Google Gemini. Les données transmises sont
                        limitées au thème de la semaine et à la saison actuelle. Aucune donnée personnelle identifiante
                        n'est partagée. Les suggestions sont générées sans profilage individuel.
                    </Typography>

                    {/* Section 10 */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
                        10. Contact
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        <strong>Délégué à la Protection des Données (DPO)</strong><br />
                        Email : dpo@secondlifeexchange.com<br /><br />
                        Pour toute question relative à vos données personnelles, n'hésitez pas à nous contacter.
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default PolitiqueConfidentialitePage;