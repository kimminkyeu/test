import log from '@/lib/logger';
import SoopLiveDetector from '@/service/detector/SoopLiveDetector';
import LiveDetectorService from '@/service/LiveDetectorService';
import cron from 'node-cron';

cron.schedule('* * * * *', () => {
  // log.info('running a task every minute');
  // new LiveDetectorService().detectionTask();
});

export default cron;
