---
id: hardhat-tutorial
title: Hardhat Tutorial
sidebar_label: Hardhat Tutorial
slug: /hardhat-tutorial
---



# Local testing using Hardhat and Docker
Below are steps to be followed when testing the indexer locally using Hardhat and Docker.

NB: All the files must be configured as per guideline above.

1. Removing stale data
   ```
   docker-compose down -v
   ```

2. Restarting docker
   ```
   docker-compose up -d
   ```

3. Deploying contract
   ```
   cd contracts
   rm -r deployments
   pnpm hardhat deploy
   ```
   Note that this will delete the previous deployment of the smart contract and re-deploy to prevent `node synced status` errors.

   More information on how to deploy contracts using Hardhat can be found [here](https://hardhat.org/hardhat-runner/docs/guides/deploying).

4. Generating code
   ```
   cd ..
   envio codegen
   ```

5. Running the indexer
   ```
   pnpm start
   ```

6. Running some tasks
   ```
   pnpm hardhat task:1 --parameter-1 value-1
   ```
   More information on how to create and run tasks using Hardhat can be found [here](https://hardhat.org/hardhat-runner/docs/advanced/create-task).

7. Checking the results on local Hasura
   ```
   ./generated/register_tables_with_hasura.sh
   ```
   and open http://localhost:8080/console.

---