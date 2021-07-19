const connectDB = require("./db");
const readCsv = require("./loadAndParseCSV");
const util = require("./util");

// Schemas for documents
const json_schema = [
  {
    "@type": "Class",
    "@id": "Country",
    "@key": {
      "@type": "Lexical",
      "@fields": ["Name"],
    },
    Name: "xsd:string",
  },
  {
    "@type": "Class",
    "@id": "BootcampInfo",
    "@subdocument": [],
    "@key": {
      "@type": "ValueHash",
      "@fields": ["BootcampName"],
    },
    BootcampName: "xsd:string",
    AttendedBootcamp: "xsd:string",
    BootcampFinish: "xsd:string",
    BootcampLoanYesNo: "xsd:string",
    BootcampRecommend: "xsd:string",
  },
  {
    "@type": "Class",
    "@id": "PersonalInfo",
    "@subdocument": [],
    "@key": {
      "@type": "ValueHash",
      "@fields": ["Gender"],
    },
    Gender: "xsd:string",
    HasChildren: "xsd:string",
    HasDebt: "xsd:string",
    HasFinancialDependents: "xsd:string",
    HasHomeMortgage: "xsd:string",
    HasServedInMilitary: "xsd:string",
    HasStudentDebt: "xsd:string",
    HomeMortgageOwe: "xsd:string",
    Income: "xsd:string",
    IsEthnicMinority: "xsd:string",
    MaritalStatus: "xsd:string",
  },
  {
    "@type": "Class",
    "@id": "JobInfo",
    "@subdocument": [],
    "@key": {
      "@type": "ValueHash",
      "@fields": ["JobPref"],
    },
    IsSoftwareDev: "xsd:string",
    IsUnderEmployed: "xsd:string",
    JobApplyWhen: "xsd:string",
    JobInterest: { "@type": "Set", "@class": "Job" },
    JobPref: "xsd:string",
    JobRelocateYesNo: "xsd:string",
    JobRoleInterest: "xsd:string",
  },
  {
    "@type": "Class",
    "@id": "Coder",
    "@base": "Coder_",
    "@key": {
      "@type": "Lexical",
      "@fields": ["Id"],
    },
    Id: "xsd:string",
    Age: "xsd:string",
    BootcampInfo: "BootcampInfo",
    EventsAttended: { "@type": "Set", "@class": "Event" },
    CommuteTime: "xsd:string",
    CityPopulation: "xsd:string",
    CountryCitizen: "Country",
    CountryLive: "Country",
    EmploymentField: "xsd:string",
    EmploymentStatus: "xsd:string",
    ExpectedEarning: "xsd:string",
    FinanciallySupporting: "xsd:string",
    FirstDevJob: "xsd:string",
    PersonalInfo: "PersonalInfo",
    JobInfo: "JobInfo",
    HoursLearning: "xsd:string",
    LanguageAtHome: "xsd:string",
    MoneyForLearning: "xsd:string",
    MonthsProgramming: "xsd:string",
    ListensToPodcast: { "@type": "Set", "@class": "Podcast" },
    UsesResource: { "@type": "Set", "@class": "Resource" },
    SchoolDegree: "xsd:string",
    SchoolMajor: "xsd:string",
    StudentDebtOwe: "xsd:string",
    Channels: { "@type": "Set", "@class": "Channel" },
  },
];

const runScript = async () => {
  try {
    // connect to db
    const client = await connectDB();
    const CoderDB = "NewCoder_test017";
    const instanceData = await readCsv();

    // insert Job Enum schema at start
    json_schema.unshift({
      "@type": "Enum",
      "@id": "Job",
      "@value": [...util.getJobs(Object.keys(instanceData[0])), "NA"],
    });

    // insert Podcast Enum schema at start
    json_schema.unshift({
      "@type": "Enum",
      "@id": "Podcast",
      "@value": [...util.getPodcasts(Object.keys(instanceData[0])), "NA"],
    });

    // insert Resource Enum schema at start
    json_schema.unshift({
      "@type": "Enum",
      "@id": "Resource",
      "@value": [...util.getResources(Object.keys(instanceData[0])), "NA"],
    });

    // insert Channel Enum schema at start
    json_schema.unshift({
      "@type": "Enum",
      "@id": "Channel",
      "@value": [...util.getChannels(Object.keys(instanceData[0])), "NA"],
    });

    // insert Event Enum schema at start
    json_schema.unshift({
      "@type": "Enum",
      "@id": "Event",
      "@value": [...util.getEvents(Object.keys(instanceData[0])), "NA"],
    });

    await client.createDatabase(CoderDB, {
      label: "New Coder Survey Database",
      comment: "Created new coder survey database",
    });

    client.db(CoderDB);
    await client.addDocument(json_schema, { graph_type: "schema" });
    console.log("Created Schema successfully");

    // insert Country documents
    const countryInstances = util
      .getDistinctCountries(instanceData)
      .map((country) => {
        return {
          "@type": "Country",
          Name: country,
        };
      });
    await client.addDocument(countryInstances);

    // get docuemnts to insert into database
    const coderInstances = util.getInstances(instanceData);

    // Insert list of documents in chunks 
    let i, j, chunkRows, chunk = 2000;
    for (i = 0, j = coderInstances.length; i < j; i += chunk) {
      chunkRows = coderInstances.slice(i, i + chunk);
      await client.addDocument(chunkRows);
      console.log(chunkRows.length + " Instances Inserted");
    }

    const documents = await client.getDocument({ as_list: true });
    console.log("Successfully Inserted "+documents.length+" instances");
  
  } catch (error) {
    console.error(error);
  }
};

runScript();
