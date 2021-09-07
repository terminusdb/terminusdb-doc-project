const { WOQL } = require("@terminusdb/terminusdb-client");

const getMostPopularJobs = async (client) => {
  const query = WOQL.select(
    "v:JobInterest",
    "v:JobInterestGroupCount",
    "v:JobRoleInterest_group"
  )
    .order_by("v:JobInterestGroupCount")
    .and(
      WOQL.group_by("JobInterest", ["Id"], "JobRoleInterest_group")
        .triple("v:Coder", "Id", "v:Id")
        .triple("v:Coder", "JobInfo", "v:JobInfo")
        .triple("v:JobInfo", "JobInterest", "v:JobInterest"),

      WOQL.length("v:JobRoleInterest_group", "v:JobInterestGroupCount")
      //   WOQL.evaluate(WOQL.div("v:TheCount", 10 ), "v:Result")
    );

  const result = await client.query(query);

  // console.log(result.bindings);
  return result.bindings;
};

const getMostPopularResource = async (client) => {
  const query = WOQL.select(
    "v:UsesResource",
    "v:UsesResourceGroupCount",
    "v:UsesResource_group"
  )
    .order_by("v:UsesResourceGroupCount")
    .and(
      WOQL.group_by("UsesResource", ["Id"], "UsesResource_group")
        .triple("v:Coder", "Id", "v:Id")
        .triple("v:Coder", "Id", "v:Id")
        .triple("v:Coder", "UsesResource", "v:UsesResource"),

      WOQL.length("v:UsesResource_group", "v:UsesResourceGroupCount")
    );

  const result = await client.query(query);

  // console.log(result.bindings);
  return result.bindings;
};

const getMostPopularChannel = async (client) => {
  const query = WOQL.select(
    "v:Channels",
    "v:ChannelsGroupCount",
    "v:Channels_group"
  )
    .order_by("v:ChannelsGroupCount")
    .and(
      WOQL.group_by("Channels", ["Id"], "Channels_group")
        .triple("v:Coder", "Id", "v:Id")
        .triple("v:Coder", "Channels", "v:Channels"),

      WOQL.length("v:Channels_group", "v:ChannelsGroupCount")
    );

  const result = await client.query(query);

  // console.log(result.bindings);
  return result.bindings;
};

const getMostPopularPodcast = async (client) => {
  const query = WOQL.select(
    "v:ListensToPodcast",
    "v:ListensToPodcastGroupCount",
    "v:ListensToPodcast_group"
  )
    .order_by("v:ListensToPodcastGroupCount")
    .and(
      WOQL.group_by("ListensToPodcast", ["Id"], "ListensToPodcast_group")
        .triple("v:Coder", "Id", "v:Id")
        .triple("v:Coder", "ListensToPodcast", "v:ListensToPodcast"),

      WOQL.length("v:ListensToPodcast_group", "v:ListensToPodcastGroupCount")
    );

  const result = await client.query(query);

  // console.log(result.bindings);
  return result.bindings;
};

const getMostPopularCodeEvent = async (client) => {
  const query = WOQL.select(
    "v:EventsAttended",
    "v:EventsAttendedGroupCount",
    "v:EventsAttended_group"
  )
    .order_by("v:EventsAttendedGroupCount")
    .and(
      WOQL.group_by("EventsAttended", ["Id"], "EventsAttended_group")
        .triple("v:Coder", "Id", "v:Id")
        .triple("v:Coder", "EventsAttended", "v:EventsAttended"),

      WOQL.length("v:EventsAttended_group", "v:EventsAttendedGroupCount")
    );

  const result = await client.query(query);

  // console.log(result.bindings);
  return result.bindings;
};

const getCodersBetween2030Unemployed = async (client) => {
  const query = WOQL.count("v:CountOfUnemployedCoders").and(
    WOQL.triple("v:Coder", "Id", "v:Id"),
    WOQL.triple("v:Coder", "Age", "v:Age"),
    WOQL.greater("v:Age", WOQL.string(19)),
    WOQL.less("v:Age", WOQL.string(31)),
    WOQL.triple("v:Coder", "EmploymentStatus", "v:EmploymentStatus"),
    WOQL.or(
      WOQL.triple(
        "v:Coder",
        "EmploymentStatus",
        WOQL.string("Not working but looking for work")
      ),
      WOQL.triple("v:Coder", "EmploymentStatus", WOQL.string("Unable to work")),
      WOQL.triple(
        "v:Coder",
        "EmploymentStatus",
        WOQL.string("A stay-at-home parent or homemaker")
      )
    )
  );

  const result = await client.query(query);

  // console.log(result.bindings);
  return result.bindings;
};

const getMostUnderEmployedCountry = async (client) => {
  const query = WOQL.select(
    "v:CountryLiveGroupCount",
    "v:CountryLive",
    "v:CountryLive_group"
  )
    .order_by("v:CountryLiveGroupCount")
    .and(
      WOQL.group_by("CountryLive", ["Id"], "CountryLive_group")
        .triple("v:Coder", "Id", "v:Id")
        .triple("v:Coder", "CountryLive", "v:CountryLive")
        .triple("v:Coder", "JobInfo", "v:JobInfo")
        .triple("v:JobInfo", "IsUnderEmployed", "v:IsUnderEmployed")
        .triple("v:JobInfo", "IsUnderEmployed", WOQL.string("1")),
      WOQL.length("v:CountryLive_group", "v:CountryLiveGroupCount")
    );

  const result = await client.query(query);

  // console.log(result.bindings);
  return result.bindings;
};

const getCountOfCodersNotInComputerField = async (client) => {
  const query = WOQL.count("v:CountOfCoders").and(
    WOQL.triple("v:Coder", "Id", "v:Id"),
    WOQL.or(
      WOQL.triple("v:Coder", "SchoolMajor", WOQL.string("Computer Science")),
      WOQL.triple(
        "v:Coder",
        "SchoolMajor",
        WOQL.string("Information Technology")
      ),
      WOQL.triple(
        "v:Coder",
        "SchoolMajor",
        WOQL.string("Computer Software Engineering")
      ),
      WOQL.triple(
        "v:Coder",
        "SchoolMajor",
        WOQL.string("Computer and Information Systems Security")
      ),
      WOQL.triple("v:Coder", "SchoolMajor", WOQL.string("Computer Networking"))
    ),
    WOQL.not().triple(
      "v:Coder",
      "EmploymentField",
      WOQL.string("software development and IT")
    ),
    WOQL.not().triple("v:Coder", "EmploymentField", WOQL.string("NA")),
    WOQL.triple("v:Coder", "SchoolMajor", "v:SchoolMajor"),
    WOQL.triple("v:Coder", "EmploymentField", "v:EmploymentField")
  );

  const result = await client.query(query);

  // console.log(result.bindings);
  return result.bindings;
};

const getAverageIncomeOfCountries = async (client) => {
  // const query = WOQL.select(
  //   "v:CountryLive",
  //   "v:CountryLive_group",
  //   "v:total"
  // ).and(
  //   WOQL.group_by("CountryLive", ["Income"], "CountryLive_group")
  //     .triple("v:Coder", "Id", "v:Id")
  //     .triple("v:Coder", "CountryLive", "v:CountryLive")
  //     .triple("v:Coder", "PersonalInfo", "v:PersonalInfo")
  //     .triple("v:PersonalInfo", "Income", "v:Income"),
  //   WOQL.sum("v:CountryLive_group", "v:total")
  // );

  // const result = await client.query(query);

  // console.log(result.bindings);
};

module.exports = {
  getMostPopularJobs,
  getMostPopularResource,
  getMostPopularChannel,
  getMostPopularPodcast,
  getMostPopularCodeEvent,
  getCodersBetween2030Unemployed,
  getMostUnderEmployedCountry,
  getCountOfCodersNotInComputerField,
  getAverageIncomeOfCountries,
};
