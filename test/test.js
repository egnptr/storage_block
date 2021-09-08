const Storage = artifacts.require("./Storage.sol");
var assert = require("assert");

require("chai").use(require("chai-as-promised")).should();

contract("Storage", ([deployer, uploader]) => {
  let storage;

  before(async () => {
    storage = await Storage.deployed();
  });

  describe("Deployment", async () => {
    it("Contract deploys successfully", async () => {
      const address = await storage.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
  });

  describe("Storing a file", async () => {
    let result, fileCount;
    const fileHash = "QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb";
    const fileSize = "999";
    const fileType = "img/png";
    const fileName = "test.png";
    const fileDescription = "a description";

    before(async () => {
      result = await storage.uploadFile(
        fileHash,
        fileSize,
        fileType,
        fileName,
        fileDescription,
        { from: uploader }
      );
      fileCount = await storage.totalFileCount();
    });

    describe("Success", () => {
      it("Upload a file", async () => {
        assert.equal(fileCount, 1);
        const event = result.logs[0].args;
        assert.equal(
          event.fileId.toNumber(),
          fileCount.toNumber(),
          "ID is correct"
        );
        assert.equal(event.fileHash, fileHash, "Hash is correct");
        assert.equal(event.fileSize, fileSize, "Size is correct");
        assert.equal(event.fileType, fileType, "Type is correct");
        assert.equal(event.fileName, fileName, "Name is correct");
        assert.equal(
          event.fileDescription,
          fileDescription,
          "Description is correct"
        );
        assert.equal(event.uploader, uploader, "Uploader is correct");
      });

      it("Get uploaded file", async () => {
        const file = await storage.files(fileCount - 1);
        assert.equal(
          file.fileId.toNumber(),
          fileCount.toNumber(),
          "ID is correct"
        );
        assert.equal(file.fileHash, fileHash, "Hash is correct");
        assert.equal(file.fileSize, fileSize, "Size is correct");
        assert.equal(file.fileName, fileName, "Name is correct");
        assert.equal(
          file.fileDescription,
          fileDescription,
          "Description is correct"
        );
        assert.equal(file.uploader, uploader, "Uploader is correct");
      });
    });

    describe("Failure", () => {
      it("File must have hash", async () => {
        await storage.uploadFile(
          "",
          fileSize,
          fileType,
          fileName,
          fileDescription,
          { from: uploader }
        ).should.be.rejected;
      });

      it("File must have size", async () => {
        await storage.uploadFile(
          fileHash,
          "",
          fileType,
          fileName,
          fileDescription,
          { from: uploader }
        ).should.be.rejected;
      });

      it("File must have type", async () => {
        await storage.uploadFile(
          fileHash,
          fileSize,
          "",
          fileName,
          fileDescription,
          { from: uploader }
        ).should.be.rejected;
      });

      it("File must have name", async () => {
        await storage.uploadFile(
          fileHash,
          fileSize,
          fileType,
          "",
          fileDescription,
          { from: uploader }
        ).should.be.rejected;
      });

      it("File must have description", async () => {
        await storage.uploadFile(fileHash, fileSize, fileType, fileName, "", {
          from: uploader,
        }).should.be.rejected;
      });
    });
  });

  describe("Editing a file", () => {
    let edited, fileCount;
    const fileName = "test.png";
    const fileDescription = "a description";

    before(async () => {
      fileCount = await storage.totalFileCount();
      edited = await storage.updateFile(fileCount, "a new description", {
        from: uploader,
      });
    });

    describe("Success", () => {
      it("Change description", async () => {
        const newEvent = edited.logs[0].args;
        assert.equal(newEvent.updater, uploader, "Updater is correct");
        assert.equal(
          newEvent.fileId.toNumber(),
          fileCount.toNumber(),
          "ID is correct"
        );
        assert.equal(newEvent.fileName, fileName, "Name is correct");
        assert.notEqual(
          newEvent.fileDescription,
          fileDescription,
          "Description is changed"
        );
      });
    });

    describe("Failure", () => {
      it("Only the owner can edit their own file", async () => {
        await storage.updateFile(fileCount, "a new description").should.be
          .rejected;
      });

      it("To edit file must have ID", async () => {
        await storage.updateFile("", "a new description", { from: uploader })
          .should.be.rejected;
      });

      it("To edit file must have description", async () => {
        await storage.updateFile(fileCount, "", { from: uploader }).should.be
          .rejected;
      });
    });
  });

  describe("Deleting a file", () => {
    let deleted, fileCount, fileIndex;

    before(async () => {
      fileCount = await storage.totalFileCount();
      deleted = await storage.deleteFile(fileCount, { from: uploader });
      fileIndex = await storage.fileIndex();
    });

    describe("Success", () => {
      it("Delete file", async () => {
        const deleteEvent = deleted.logs[0].args;
        assert.equal(deleteEvent.deleter, uploader, "Deleter is correct");
        assert.equal(
          deleteEvent.fileId.toNumber(),
          fileCount.toNumber(),
          "ID is correct"
        );
      });

      it("Check total count", async () => {
        assert.notEqual(fileIndex, fileCount);
      });

      it("Check file", async () => {
        const deleteEvent = deleted.logs[0].args;
        let fileExist = await storage.fileExist(deleteEvent.fileId);
        assert.equal(fileExist, false, "File doesn't exist");
      });
    });

    describe("Failure", () => {
      it("Only the owner can delete their own file", async () => {
        await storage.deleteFile(fileCount).should.be.rejected;
      });

      it("To delete file must have ID", async () => {
        await storage.deleteFile("", { from: uploader }).should.be.rejected;
      });
    });
  });
});
