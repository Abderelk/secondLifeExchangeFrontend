import { Box, Typography } from '@mui/material';

const HowItWorks = () => {
    const steps = [
        { bold: 'Chaque lundi', text: ', un nouveau thème est lancé' },
        { bold: 'Proposez vos objets', text: ' correspondant au thème de la semaine' },
        { bold: 'Découvrez', text: ' ce que les autres membres proposent' },
        { bold: 'Contactez', text: ' les personnes pour organiser un échange' },
        { bold: 'Partagez votre expérience', text: " et encouragez l'économie circulaire !" },
    ];

    return (
        <Box
            sx={{
                backgroundColor: '#EFF6FF',
                borderRadius: '16px',
                padding: 3,
                mt: 5,
            }}
        >
            <Typography variant="subtitle1" fontWeight={600} color="#1F2937" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                <span>💡</span>
                Comment ça marche ?
            </Typography>

            <Box component="ul" sx={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {steps.map((step, index) => (
                    <Box
                        component="li"
                        key={index}
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1,
                            mb: 1.5,
                            color: '#374151',
                            fontSize: '14px',
                        }}
                    >
                        <span style={{ color: '#9CA3AF' }}>•</span>
                        <span>
                            <strong style={{ color: '#1F2937' }}>{step.bold}</strong>
                            {step.text}
                        </span>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default HowItWorks;