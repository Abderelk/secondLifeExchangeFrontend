import { Card, Typography, TextField, MenuItem } from '@mui/material';

const categories = [
  { value: 'vêtements', label: 'Vêtements' },
  { value: 'électronique', label: 'Électronique' },
  { value: 'livres', label: 'Livres' },
  { value: 'meubles', label: 'Meubles' },
  { value: 'décoration', label: 'Décoration' },
  { value: 'jouets', label: 'Jouets' },
  { value: 'sport', label: 'Sport' },
  { value: 'outils', label: 'Outils' },
  { value: 'cuisine', label: 'Cuisine' },
  { value: 'jardin', label: 'Jardin' },
  { value: 'multimédia', label: 'Multimédia' },
  { value: 'autre', label: 'Autre' },
];

const conditions = [
  { value: 'neuf', label: 'Neuf - Jamais utilisé' },
  { value: 'très bon', label: 'Très bon - Quasi neuf' },
  { value: 'bon', label: "Bon - Quelques traces d'usure" },
  { value: 'correct', label: 'Correct - Usure visible' },
  { value: 'usé', label: 'Usé - À rénover' },
];

interface ItemFormFieldsProps {
  title: string;
  description: string;
  category: string;
  condition: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ItemFormFields = ({
  title,
  description,
  category,
  condition,
  onChange,
}: ItemFormFieldsProps) => (
  <Card sx={{ p: 3, borderRadius: '16px', mb: 3 }}>
    <Typography fontWeight={600} color="#1F2937" gutterBottom>
      Informations
    </Typography>

    <TextField
      fullWidth
      label="Titre"
      name="title"
      value={title}
      onChange={onChange}
      required
      sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
      placeholder="Ex: Pull en laine bleu"
    />

    <TextField
      fullWidth
      label="Description"
      name="description"
      value={description}
      onChange={onChange}
      required
      multiline
      rows={3}
      sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
      placeholder="Décrivez votre objet (état, taille, particularités...)"
    />

    <TextField
      fullWidth
      select
      label="Catégorie"
      name="category"
      value={category}
      onChange={onChange}
      required
      sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
    >
      {categories.map((cat) => (
        <MenuItem key={cat.value} value={cat.value}>
          {cat.label}
        </MenuItem>
      ))}
    </TextField>

    <TextField
      fullWidth
      select
      label="État"
      name="condition"
      value={condition}
      onChange={onChange}
      required
      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
    >
      {conditions.map((cond) => (
        <MenuItem key={cond.value} value={cond.value}>
          {cond.label}
        </MenuItem>
      ))}
    </TextField>
  </Card>
);

export default ItemFormFields;
