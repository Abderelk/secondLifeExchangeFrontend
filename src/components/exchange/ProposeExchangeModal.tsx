// src/components/exchange/ProposeExchangeModal.tsx

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CardMedia,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Close, SwapHoriz } from '@mui/icons-material';
import { ItemSelector } from './ItemSelector';
import { createExchange } from '../../services/exchangeService';

interface RequestedItem {
  id: string;
  title: string;
  image: string;
  ownerName: string;
  location: string;
}

interface ProposeExchangeModalProps {
  open: boolean;
  onClose: () => void;
  requestedItem: RequestedItem;
  onSuccess?: () => void;
}

export const ProposeExchangeModal = ({
  open,
  onClose,
  requestedItem,
  onSuccess,
}: ProposeExchangeModalProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      await createExchange({
        requestedItemId: requestedItem.id,
        offeredItemIds: selectedItems,
        message: message.trim() || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 2000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de l'envoi de la proposition");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedItems([]);
    setMessage('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #E5E7EB',
          pb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SwapHoriz sx={{ color: '#22C55E' }} />
          <Typography variant="h6" fontWeight={600}>
            Proposer un échange
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        {success ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: '#DCFCE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <SwapHoriz sx={{ fontSize: 40, color: '#22C55E' }} />
            </Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Proposition envoyée ! 🎉
            </Typography>
            <Typography color="text.secondary">
              {requestedItem.ownerName} recevra votre proposition et pourra l'accepter ou la refuser.
            </Typography>
          </Box>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Item demandé */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Vous souhaitez obtenir
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  backgroundColor: '#F9FAFB',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                }}
              >
                <CardMedia
                  component="img"
                  image={requestedItem.image}
                  alt={requestedItem.title}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '8px',
                    objectFit: 'cover',
                  }}
                />
                <Box>
                  <Typography fontWeight={600} color="#1F2937">
                    {requestedItem.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {requestedItem.ownerName} • {requestedItem.location}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Sélection des items */}
            <Box sx={{ mb: 4 }}>
              <ItemSelector
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                maxSelection={5}
              />
            </Box>

            {/* Message */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Ajouter un message (optionnel)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Bonjour ! Je suis intéressé(e) par votre objet..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                inputProps={{ maxLength: 500 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}
              >
                {message.length}/500
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>

      {!success && (
        <DialogActions sx={{ px: 3, pb: 3, borderTop: '1px solid #E5E7EB', pt: 2 }}>
          <Button
            onClick={handleClose}
            sx={{
              color: '#6B7280',
              textTransform: 'none',
            }}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              backgroundColor: '#22C55E',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              px: 4,
              '&:hover': { backgroundColor: '#16A34A' },
              '&:disabled': { backgroundColor: '#86EFAC' },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: '#fff' }} />
            ) : (
              'Envoyer la proposition'
            )}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ProposeExchangeModal;