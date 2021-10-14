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
      await storage.uploadFile(
        fileHash,
        fileSize,
        fileType,
        fileName,
        fileDescription,
        { from: uploader }
      );
      await storage.uploadFile(
        fileHash,
        fileSize,
        fileType,
        fileName,
        fileDescription,
        { from: uploader }
      );
      await storage.uploadFile(
        fileHash,
        fileSize,
        fileType,
        fileName,
        fileDescription,
        { from: uploader }
      );
      await storage.uploadFile(
        fileHash,
        fileSize,
        fileType,
        fileName,
        fileDescription,
        { from: uploader }
      );
      result = await storage.uploadFile(
        fileHash,
        fileSize,
        fileType,
        fileName,
        fileDescription,
        { from: uploader }
      );
      fileCount = await storage.getTotalFile();
    });

    describe("Success", () => {
      it("Upload a file", async () => {
        assert.equal(fileCount, 5, "File Count doesn't match");
        const event = result.logs[0].args;
        assert.equal(
          event.fileId.toNumber(),
          fileCount.toNumber(),
          "ID is different"
        );
        assert.equal(event.fileHash, fileHash, "Hash is different");
        assert.equal(event.fileSize, fileSize, "Size is different");
        assert.equal(event.fileType, fileType, "Type is different");
        assert.equal(event.fileName, fileName, "Name is different");
        assert.equal(
          event.fileDescription,
          fileDescription,
          "Description is different"
        );
        assert.equal(event.uploader, uploader, "Uploader is different");
      });

      it("Get uploaded file", async () => {
        const file = await storage.files(fileCount - 1);
        assert.equal(
          file.fileId.toNumber(),
          fileCount.toNumber(),
          "ID is different"
        );
        assert.equal(file.fileHash, fileHash, "Hash is different");
        assert.equal(file.fileSize, fileSize, "Size is different");
        assert.equal(file.fileName, fileName, "Name is different");
        assert.equal(
          file.fileDescription,
          fileDescription,
          "Description is different"
        );
        assert.equal(file.uploader, uploader, "Uploader is different");
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
    let edited;
    const fileName = "test.png";
    const fileDescription = "a description";

    before(async () => {
      await storage.updateFile(3, "a new description", {
        from: uploader,
      });
      edited = await storage.updateFile(5, "a new description", {
        from: uploader,
      });
    });

    describe("Success", () => {
      it("Change description", async () => {
        const newEvent = edited.logs[0].args;
        assert.equal(newEvent.updater, uploader, "Updater is different");
        assert.equal(newEvent.fileId.toNumber(), 5, "ID is different");
        assert.equal(newEvent.fileName, fileName, "Name is different");
        assert.notEqual(
          newEvent.fileDescription,
          fileDescription,
          "Description is changed"
        );
      });
    });

    describe("Failure", () => {
      it("Only the owner can edit their own file", async () => {
        await storage.updateFile(5, "a new description").should.be.rejected;
      });

      it("To edit file must have ID", async () => {
        await storage.updateFile("", "a new description", { from: uploader })
          .should.be.rejected;
      });

      it("To edit file must have description", async () => {
        await storage.updateFile(5, "", { from: uploader }).should.be.rejected;
      });
    });
  });

  describe("Deleting a file", () => {
    let deleted, fileCount;

    before(async () => {
      await storage.deleteFile(2, { from: uploader });
      deleted = await storage.deleteFile(3, { from: uploader });
      fileCount = await storage.getTotalFile();
    });

    describe("Success", () => {
      it("Delete file", async () => {
        const deleteEvent = deleted.logs[0].args;
        assert.equal(deleteEvent.deleter, uploader, "Deleter is different");
        assert.equal(deleteEvent.fileId.toNumber(), 3, "ID is different");
      });

      it("Check if total count decreased", async () => {
        assert.equal(fileCount, 3, "File count doesn't match");
      });

      it("Check if file is deleted", async () => {
        let fileExist1 = await storage.fileExist(2);
        let fileExist2 = await storage.fileExist(3);
        assert.equal(fileExist1, false, "File exist");
        assert.equal(fileExist2, false, "File exist");
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
