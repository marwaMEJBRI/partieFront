import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';
import { addPrice } from '../../../../actions/pricing.actions';

export default function PriceFormDialog({ open, onClose }) {
  const dispatch = useDispatch();
  const initialFormValues = {
    title: '',
    description: '',
    price: '',
    
  };
  const [formValues, setFormValues] = useState(initialFormValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = () => {
    // Assurez-vous de convertir `schedule` dans le format attendu par votre API si nécessaire
    dispatch(addPrice(formValues)).then(() => {
      alert('Price ajoutée avec succès! ✅');
      onClose();
      setFormValues(initialFormValues);
    }).catch((error) => {
      console.error('Erreur lors de l\'ajout de la eventication:', error);
      alert('Erreur lors de l\'ajout de la eventication ❌');
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Typography variant="h6" gutterBottom>Ajouter une Priceication</Typography>
        <TextField autoFocus margin="dense" name="title" label="Titre" type="text" fullWidth value={formValues.title} onChange={handleChange} />
        <TextField margin="dense" name="description" label="Description" type="text" fullWidth multiline maxRows={4} value={formValues.description} onChange={handleChange} />
        <TextField margin="dense" name="price" label="Price" type="string" fullWidth value={formValues.price} onChange={handleChange} />
       
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Annuler</Button>
        <Button onClick={handleSubmit} color="primary">Ajouter</Button>
      </DialogActions>
    </Dialog>
  );
}