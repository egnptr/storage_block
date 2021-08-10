import React, { Component } from "react";
import Button from "@material-tailwind/react/Button";
import Card from "@material-tailwind/react/Card";
import CardHeader from "@material-tailwind/react/CardHeader";
import CardBody from "@material-tailwind/react/CardBody";
import Textarea from "@material-tailwind/react/Textarea";
import { CloudUploadIcon, XIcon } from "@heroicons/react/outline";
import ReactLoading from "react-loading";

class Upload extends Component {
  render() {
    const ipfsResult = JSON.stringify(this.props.result, null, 4);

    return (
      <>
        <div className="bg-gray-100 pt-14 pb-28 px-3 md:px-8 h-auto">
          <div className="container mx-auto max-w-full"></div>
        </div>

        <div className="px-3 md:px-8 h-auto -mt-24">
          <div className="container mx-auto max-w-full">
            <div className="grid grid-cols-1 xl:grid-cols-6">
              <div className="xl:col-start-1 xl:col-end-5 px-4 mb-16">
                <Card>
                  <CardHeader color="purple" contentPosition="none">
                    <div className="w-full flex items-center justify-between">
                      <h2 className="text-white text-2xl">File Upload</h2>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="md:flex">
                      <div className="w-full">
                        <div className="p-3">
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const description = this.desc.value;
                              this.props.uploadFile(description);
                            }}
                          >
                            <div className="mb-2">
                              <label
                                htmlFor="desc"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Description
                              </label>
                              <div className="mt-1">
                                <textarea
                                  id="desc"
                                  name="desc"
                                  rows={3}
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
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Attachments
                              </label>
                              {this.props.name == null && (
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                  <div className="space-y-1 text-center">
                                    <CloudUploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                      <label
                                        htmlFor="file-upload"
                                        className="mx-auto relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                      >
                                        <span>Select a file</span>
                                        <input
                                          id="file-upload"
                                          name="file-upload"
                                          type="file"
                                          className="sr-only"
                                          onChange={this.props.fileReader}
                                          required
                                        />
                                      </label>
                                    </div>
                                    <p className="p-3 text-xs text-gray-500">
                                      Any type of file is acceptable
                                    </p>
                                  </div>
                                </div>
                              )}
                              {this.props.name != null && (
                                <div className="mt-1 flex px-3 pt-3 border-2 border-gray-300 border-dashed rounded-md">
                                  <div className="mt-2 pb-3 grid grid-cols-2 text-gray-600">
                                    {this.props.name}
                                    <Button
                                      color="transparent"
                                      buttonType="link"
                                      size="lg"
                                      iconOnly
                                      rounded
                                      ripple="light"
                                      onClick={this.props.clearFile}
                                    >
                                      <XIcon className="-mt-6 h-6 w-6 fill-current text-red-400" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="mt-3 text-center pb-3">
                              {" "}
                              {this.props.loading === false ? (
                                <Button
                                  color="purple"
                                  rounded
                                  size="lg"
                                  className="w-full h-12 text-white hover:bg-purple-700"
                                >
                                  Upload
                                </Button>
                              ) : (
                                <ReactLoading
                                  type="bubbles"
                                  color="#6D28D9"
                                  height={40}
                                  width={114}
                                  className="mx-auto"
                                />
                              )}{" "}
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
              <div className="xl:col-start-5 xl:col-end-6">
                <Textarea
                  color="indigo"
                  size="sm"
                  outline={true}
                  placeholder="IPFS API Response:"
                  disabled
                  value={this.props.result != null ? ipfsResult : ""}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Upload;
