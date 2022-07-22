import mongoose, {Mongoose, Model} from "mongoose";
import type {
  Adapter,
  AdapterUser,
  AdapterSession,
  VerificationToken as AdapterVerificationToken,
} from "next-auth/adapters";
import type {Account as AdapterAccount} from "next-auth";

interface MongooseAdapterModels {
  user?: Model<AdapterUser>;
  session?: Model<AdapterSession>;
  account?: Model<AdapterAccount>;
  verificationToken?: Model<AdapterVerificationToken>;
}

const MongooseAdapter = (
  dbConnect: Promise<Mongoose>,
  models?: MongooseAdapterModels
): Adapter => {
  // Load Backup Models
  if (!mongoose.models.User) {
    console.log("no USER model");
    require("./models/User");
  }

  if (!mongoose.models.Session) {
    console.log("no SESSION model");
    require("./models/Session");
  }

  if (!mongoose.models.VerificationToken) {
    console.log("no VerificationToken model");
    require("./models/VerificationToken");
  }

  if (!mongoose.models.Account) {
    console.log("no ACCOUNT model");
    require("./models/Account");
  }

  // Models
  const User: Model<AdapterUser> = mongoose.models.User;
  const Session: Model<AdapterSession> = mongoose.models.Session;
  const VerificationToken: Model<AdapterVerificationToken> =
    mongoose.models.VerificationToken;
  const Account: Model<AdapterAccount> = mongoose.models.Account;

  // Methods
  const adaptorMethods: Adapter = {
    // These methods are required for all sign in flows:
    async createUser(data) {
      console.log("createUser: ", data);
      await dbConnect;
      const user = await User.create(data);
      return user;
    },

    async getUser(id) {
      console.log("getUser: ", id);
      await dbConnect;
      const user = await User.findById(id);
      console.log("getUser user: ", user);
      return user;
    },

    async getUserByEmail(email) {
      console.log("getUserByEmail: ", email);

      await dbConnect;
      const user = await User.findOne({email});
      return user;
    },
    async getUserByAccount(data) {
      console.log("getUserByAccount: ", data);
      const {providerAccountId, provider} = data;
      await dbConnect;

      // Get Account
      const account = await Account.findOne({providerAccountId, provider});
      if (!account) return null;

      // Find User
      const user = await adaptorMethods.getUser(account.userId);
      return user;
    },
    async updateUser(data) {
      console.log("updateUser: ", data);
      const {id, ...restData} = data;
      await dbConnect;
      const user = await User.findByIdAndUpdate(id, restData, {
        new: true,
        runValidators: true,
        returnDocument: "after",
      });

      return user!;
    },
    async deleteUser(userId) {
      console.log("deleteUser: ", userId);

      await dbConnect;
      const user = await User.findByIdAndDelete(userId);
      return user;
    },
    async linkAccount(data) {
      console.log("linkAccount: ", data);

      await dbConnect;
      const account = await Account.create(data);
      return account;
    },
    async unlinkAccount(data) {
      console.log("unlinkAccount: ", data);
      const {providerAccountId, provider} = data;
      await dbConnect;
      const account = await Account.findOneAndDelete({
        providerAccountId,
        provider,
      });

      if (account) return account;
    },
    async createSession(data) {
      console.log("createSession: ", data);

      await dbConnect;
      const session = await Session.create(data);
      return session;
    },
    async getSessionAndUser(sessionToken) {
      console.log("getSessionAndUser: ", sessionToken);
      await dbConnect;

      // Get Session
      const session = await Session.findOne({sessionToken});
      if (!session) return null;

      // Find User
      const user = await adaptorMethods.getUser(session.userId);
      if (!user) return null;

      return {user, session};
    },
    async updateSession(data) {
      console.log("updateSession: ", data);
      const {id, ...restData} = data;
      await dbConnect;
      const session = await Session.findByIdAndUpdate(id, restData, {
        new: true,
        runValidators: true,
      });
      return session;
    },
    async deleteSession(sessionToken) {
      console.log("deleteSession: ", sessionToken);
      await dbConnect;
      const session = await Session.findOneAndDelete({sessionToken});
      return session;
    },
    // These methods are required to support email / passwordless sign in:
    async createVerificationToken(data) {
      console.log("createVerificationToken: ", data);

      await dbConnect;
      const verificationToken = await VerificationToken.create(data);
      return verificationToken;
    },
    async useVerificationToken(data) {
      console.log("useVerificationToken: ", data);
      const {identifier, token} = data;
      await dbConnect;
      const verificationToken = await VerificationToken.findOne({
        identifier,
        token,
      });
      return verificationToken;
    },
    // ################################################################################
    // These methods will be required in a future release, but are not yet invoked:
    // async deleteUser() {
    //   return;
    // },
    // async unlinkAccount() {
    //   return;
    // },
  };

  return adaptorMethods;
};

export default MongooseAdapter;
