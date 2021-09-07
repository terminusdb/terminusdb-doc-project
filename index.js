const ejs = require("ejs");
const fs = require("fs");
const connectDB = require("./src/db");
const queries = require("./src/queries");
const createDocuments = require("./src/createDocuments");

const runScript = async () => {
  try {
    // connect to db
    const client = await connectDB();
    const CoderDB = "NewCoder_test017";

    // await client.createDatabase(CoderDB, {
    //   label: "New Coder Survey Database",
    //   comment: "Created new coder survey database",
    // });

    client.db(CoderDB);

    // await createDocuments.createSchema(client);
    // check if the list of documents have been inserted
    // getDocument by id ....
    // upateDocument (change the documentation)

    // await createDocuments.insertDocumentInstances(client);
    // getDocument dy id
    // queryDocument template pattern 

    let resultMostPopularJobs = await queries.getMostPopularJobs(client);
    resultMostPopularJobs = resultMostPopularJobs.map((jobs) => {
      return [jobs.JobInterest.slice(23), jobs.JobInterestGroupCount["@value"]];
    });

    let resultMostPopularResource = await queries.getMostPopularResource(
      client
    );
    resultMostPopularResource = resultMostPopularResource.map((resource) => {
      return [
        resource.UsesResource.slice(25),
        resource.UsesResource_group.length,
      ];
    });

    let resultMostPopularChannel = await queries.getMostPopularChannel(client);
    resultMostPopularChannel = resultMostPopularChannel.map((Channel) => {
      return [Channel.Channels.slice(23), Channel.Channels_group.length];
    });

    let resultMostPopularPodcast = await queries.getMostPopularPodcast(client);
    resultMostPopularPodcast = resultMostPopularPodcast.map((Podcast) => {
      return [
        Podcast.ListensToPodcast.slice(23),
        Podcast.ListensToPodcast_group.length,
      ];
    });

    let resultMostPopularCodeEvent = await queries.getMostPopularCodeEvent(
      client
    );
    resultMostPopularCodeEvent = resultMostPopularCodeEvent.map((CodeEvent) => {
      return [
        CodeEvent.EventsAttended.slice(23),
        CodeEvent.EventsAttended_group.length,
      ];
    });

    let resultCodersBetween2030Unemployed =
      await queries.getCodersBetween2030Unemployed(client);

    let resultMostUnderEmployedCountry =
      await queries.getMostUnderEmployedCountry(client);
    resultMostUnderEmployedCountry = resultMostUnderEmployedCountry.map(
      (Country) => {
        if (
          Country.CountryLive.slice(8).split("%20").join(" ") ===
          "Cote D'Ivoire"
        ) {
          return ["Cote D Ivoire", Country.CountryLiveGroupCount["@value"]];
        }
        return [
          Country.CountryLive.slice(8).split("%20").join(" ").toString(),
          Country.CountryLiveGroupCount["@value"],
        ];
      }
    );

    let resultCountOfCodersNotInComputerField =
      await queries.getCountOfCodersNotInComputerField(client);
    await queries.getAverageIncomeOfCountries(client);

    console.log("Execution of queries successful, rendering report file..");

    // Create a HTML report to visualize results
    ejs.renderFile(
      "./resultTemplate.ejs",
      {
        data: {
          MostPopularJobs: [
            ["Jobs", "Count of Coders"],
            ...resultMostPopularJobs,
          ],
          MostPopularResources: [
            ["Resources", "Count of Coders"],
            ...resultMostPopularResource,
          ],
          MostPopularChannel: [
            ["Channels", "Count of Coders"],
            ...resultMostPopularChannel,
          ],
          MostPopularPodcast: [
            ["Podcasts", "Count of Coders"],
            ...resultMostPopularPodcast,
          ],
          MostPopularCodeEvent: [
            ["Code Events", "Count of Coders"],
            ...resultMostPopularCodeEvent,
          ],
          CodersBetween2030Unemployed:
            resultCodersBetween2030Unemployed[0].CountOfUnemployedCoders[
              "@value"
            ],
          MostUnderEmployedCountry: [
            ["Country", "Count of UnderEmployed Coders"],
            ...resultMostUnderEmployedCountry,
          ],
          CountOfCodersNotInComputerField:
            resultCountOfCodersNotInComputerField[0].CountOfCoders["@value"],
        },
      },
      function (err, str) {
        // str => Rendered HTML string
        fs.writeFileSync("./result.html", str, "utf8");
      }
    );
  } catch (error) {
    console.error(error);
  }
};

runScript();
