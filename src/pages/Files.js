import React, { Component } from "react";
import moment from "moment";
import Card from "@material-tailwind/react/Card";
import CardHeader from "@material-tailwind/react/CardHeader";
import CardBody from "@material-tailwind/react/CardBody";
import ReactLoading from "react-loading";

class Files extends Component {
  convertBytes(bytes) {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  }

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      selectedId: 0,
    };
  }

  render() {
    return (
      <>
        <div className="bg-gray-100 pt-14 pb-28 px-3 md:px-8 h-auto">
          <div className="container mx-auto max-w-full"></div>
        </div>

        <div className="px-3 md:px-8 h-auto -mt-24">
          <div className="container mx-auto max-w-full">
            <div className="grid grid-cols-1 px-4 mb-16">
              {!this.props.isLoading ? (
                <Card>
                  <CardHeader color="green" contentPosition="left">
                    <h2 className="text-white text-2xl">List of Files</h2>
                  </CardHeader>
                  <CardBody>
                    <div className="overflow-x-auto">
                      <table className="table-auto items-center w-full bg-transparent border-collapse">
                        <thead>
                          <tr>
                            <th className="px-2 text-gray-400 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                              Name
                            </th>
                            <th className="px-2 text-gray-400 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                              Description
                            </th>
                            <th className="px-2 text-gray-400 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                              Size
                            </th>
                            <th className="px-2 text-gray-400 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                              Date
                            </th>
                            <th className="px-2 text-gray-400 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left">
                              Uploader
                            </th>
                            <th className="px-2 text-gray-400 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-light text-left"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.props.files.map((file, key) => {
                            return (
                              <tr key={key}>
                                <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                  {file.name}
                                </th>
                                <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                  {file.description}
                                </th>
                                <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                  {this.convertBytes(file.size)}
                                </th>
                                <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                  {moment
                                    .unix(file.uploadTime)
                                    .format("D MMM YYYY HH:mm")}
                                </th>
                                <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left">
                                  {file.uploader.substring(0, 12)}...
                                </th>
                                <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left space-x-2">
                                  <a
                                    href={
                                      "https://ipfs.infura.io/ipfs/" +
                                      file.ipfsHash
                                    }
                                    className="mx-auto bg-green-400 text-white rounded-xl p-2"
                                  >
                                    View
                                  </a>
                                  {this.props.account ===
                                    file.uploader.toLowerCase() && (
                                    <button
                                      className="bg-blue-400 text-white rounded-xl p-2"
                                      type="button"
                                      onClick={() =>
                                        this.setState({
                                          showModal: true,
                                          selectedId: file.id,
                                        })
                                      }
                                    >
                                      Edit
                                    </button>
                                  )}
                                  {this.props.account ===
                                    file.uploader.toLowerCase() && (
                                    <button
                                      onClick={(e) =>
                                        this.props.deleteFile(file.id, e)
                                      }
                                      className="bg-red-400 text-white rounded-xl p-2"
                                    >
                                      Delete
                                    </button>
                                  )}
                                </th>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              ) : (
                <ReactLoading
                  type="bubbles"
                  color="#2C3353"
                  height={40}
                  width={114}
                  className="mx-auto"
                />
              )}
            </div>
          </div>
        </div>

        {this.state.showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-1/2 my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-3xl font-semibold">Edit File</h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => this.setState({ showModal: false })}
                    >
                      <span className="bg-transparent text-red-600 opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        x
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <form
                      id="form1"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const description = this.desc.value;
                        this.props.updateFile(
                          e,
                          this.state.selectedId,
                          description
                        );
                        this.setState({ showModal: false, selectedId: 0 });
                      }}
                    >
                      <div className="my-4">
                        <label
                          htmlFor="desc"
                          className="block text-md font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="desc"
                            name="desc"
                            rows={5}
                            ref={(input) => {
                              this.desc = input;
                            }}
                            className="p-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                            placeholder="Enter the description of the file"
                            defaultValue={""}
                            required
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => this.setState({ showModal: false })}
                    >
                      Close
                    </button>
                    <button
                      className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="submit"
                      form="form1"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>
    );
  }
}

export default Files;
