const express = require('express');
const router = express.Router();
const signatureController = require('../controllers/signature.controller');
const { authMiddleware, bankerAuthMiddleware  } = require('../middleware/auth.middleware');

router.post('/',authMiddleware,
  signatureController.createSignature
);


router.get('/document/:documentId',bankerAuthMiddleware, 
  signatureController.getDocumentSignatures
);


router.get('/user',bankerAuthMiddleware,
  signatureController.getUserSignatures
);


router.get('/user/:userId',bankerAuthMiddleware, 
  signatureController.getUserSignatures
);


router.post('/:signatureId/verify', 
    bankerAuthMiddleware, 
  signatureController.verifySignature
);

// Update signature status
router.patch('/:signatureId/status', 
    bankerAuthMiddleware,
  signatureController.updateSignatureStatus
);

// Delete a signature
router.delete('/:signatureId', 
    bankerAuthMiddleware,
  signatureController.deleteSignature
);

module.exports = router;