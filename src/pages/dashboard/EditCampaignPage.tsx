import React, { useEffect } from 'react'
import EditCampaign from '../../components/EditCampaign'
import { useAppConfig } from '../../context/AppConfigContext';

const EditCampaignPage = () => {
  const { config } = useAppConfig();


  useEffect(() => {
    if (config?.name) {
      document.title = `EditCampaign | ${config.name}`;
    }
  }, [config]);

  return (
    <div>
        <EditCampaign/>
      
    </div>
  )
}

export default EditCampaignPage
