import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';
import { addCertif } from '../../../../actions/certif.actions';

export default function CertifFormDialog({ open, onClose }) {
  const dispatch = useDispatch();
  
  const initialFormValues = {
    title: '',
    description: '',
    responsable: '',
    type: '',
    schedule: '', // Notez que cela sera un champ de type Date
    location: ''
  };
  const [formValues, setFormValues] = useState(initialFormValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = () => {
    // Assurez-vous de convertir `schedule` dans le format attendu par votre API si nécessaire
    dispatch(addCertif(formValues)).then(() => {
      alert('Certification ajoutée avec succès! ✅');
      onClose();
      setFormValues(initialFormValues);
    }).catch((error) => {
      console.error('Erreur lors de l\'ajout de la certification:', error);
      alert('Erreur lors de l\'ajout de la certification ❌');
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Typography variant="h6" gutterBottom>Ajouter une Certification</Typography>
        <TextField autoFocus margin="dense" name="title" label="Titre" type="text" fullWidth value={formValues.title} onChange={handleChange} />
        <TextField margin="dense" name="description" label="Description" type="text" fullWidth multiline maxRows={4} value={formValues.description} onChange={handleChange} />
        <TextField margin="dense" name="responsable" label="Responsable" type="text" fullWidth value={formValues.responsable} onChange={handleChange} />
        <TextField margin="dense" name="type" label="Type" type="text" fullWidth value={formValues.type} onChange={handleChange} />
        <TextField
          margin="dense"
          name="schedule"
          label="Date et Heure"
          type="datetime-local"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={formValues.schedule}
          onChange={handleChange}
        />
        <TextField margin="dense" name="location" label="Lieu" type="text" fullWidth value={formValues.location} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Annuler</Button>
        <Button onClick={handleSubmit} color="primary">Ajouter</Button>
      </DialogActions>
    </Dialog>
  );
}