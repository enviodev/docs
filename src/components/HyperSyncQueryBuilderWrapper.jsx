import React from 'react';
import { HyperSyncQueryBuilder } from 'hypersync-query-builder-component';
import 'hypersync-query-builder-component/styles';

const HyperSyncQueryBuilderWrapper = () => {
  return (
    <div
      className="hypersync-query-builder-wrapper"
      style={{
        border: '1px solid #e1e4e8',
        borderRadius: '8px',
        padding: '20px',
        margin: '20px 0',
        backgroundColor: '#f8f9fa'
      }}
    >
      <HyperSyncQueryBuilder />
    </div>
  );
};

export default HyperSyncQueryBuilderWrapper; 
