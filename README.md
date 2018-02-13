 ## Overview


### Scripts in Repository

* ### visChangeNotifier.js
	`npm run visChangeNotifier` - This node app is responsible for monitoring kibana's internal dashboard schemas, and notifying admins on change.  If a change is made to a schema an automated email will be sent with the previous Schema and the new Schema

### Application Type

 * These app is developed using Node 6.10.3
 * The scripts require access to a MongoDb database,ElasticSearch Server, and should be called as a scheduled task.


### Logging

- This app will log its errors to a specified index in your ElasticSearch cluster , (you can change this to your needs)

 

## Information for visChangeNotifier.js

Once you run VisSecurity it will grab all Kibana\`s visualization info from ElasticSearch and compare them to KibanaVisualization collection in mongo. 

##### If those visualizations exist it will compare the info from ElasticSearch and Mongo and see if there are any changes. 

  One of the following will happen:  
  * If visualization does not exist, it will be added to mongo collection.
  * If there is a change, an email will be sent describing that change with the moment it occurred.
      * When this happens the visualization is updated as the newest, so when it will be queried again there will be no email spam if the change was intentional.
  * If there is no change the app will close
  
			
