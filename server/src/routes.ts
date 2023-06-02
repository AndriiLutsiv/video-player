import { Application } from 'express';
import { getClientInfoByUuid, updatePlayedStatus, updateCtaClickedStatus } from './db';

export const setupRoutes = (app: Application) => {
  app.get('/share/:uuid', async (req, res) => {
    console.log('req', req);
    try {
      const uuid = req.params.uuid;
      const clientInfo = await getClientInfoByUuid(uuid);
      res.status(200).json(clientInfo);
    } catch (error) {
      res.status(404).send((error as Error).message);
    }
  });

  app.post('/play/:uuid', async (req, res) => {
    try {
      const uuid = req.params.uuid;
      await updatePlayedStatus(uuid);
      res.status(200).send('Record updated');
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  });

  app.post('/cta/:uuid', async (req, res) => {
    try {
      const uuid = req.params.uuid;
      await updateCtaClickedStatus(uuid);
      res.status(200).send('Record updated');
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  });
};