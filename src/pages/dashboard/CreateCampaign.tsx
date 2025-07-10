import React, { useEffect } from 'react';
import CreateCampaignForm from '../CampaignCreate';
import { useAppConfig } from '../../context/AppConfigContext';

const CreateCampaign = () => {
    const { config } = useAppConfig();


  useEffect(() => {
    if (config?.name) {
      document.title = `Create | ${config.name}`;
    }
  }, [config]);

    return (
        <div>
            <CreateCampaignForm />
        </div>
    );
};

export default CreateCampaign;

