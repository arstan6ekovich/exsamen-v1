"use client";
import {
  useDeleteTodoMutation,
  useEditTodoMutation,
  useGetTodoQuery,
  usePostTodoMutation,
  useUploadFileMutation,
} from "@/redux/api/todo";
import Image from "next/image";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import scss from "./TodoList.module.scss";

interface TodoType {
  _id: number;
  image: string;
  title: string;
  description: string;
}

const TodoList = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TodoType>();
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { isSubmitting: isSubmittingEdit },
  } = useForm<TodoType>();
  const [uploadFileQuery] = useUploadFileMutation();
  const [postTodoMutation] = usePostTodoMutation();
  const [deleteTodoMutation] = useDeleteTodoMutation();
  const [editTodoMutation] = useEditTodoMutation();
  const { data, isLoading } = useGetTodoQuery();
  const [isEdit, setIsEdit] = useState<number | null>(null);
  console.log(data);

  const onSubmit: SubmitHandler<TodoType> = async (data) => {
    const file = data.image[0];
    const formData = new FormData();
    formData.append("file", file);

    const { data: responseFile } = await uploadFileQuery(formData);

    const newData = {
      image: responseFile.url,
      title: data.title,
      description: data.description,
    };

    await postTodoMutation(newData);
  };
  const onSubmitEdit: SubmitHandler<TodoType> = async (data) => {
    const file = data.image[0];
    const formData = new FormData();
    formData.append("file", file);

    const { data: responseFile } = await uploadFileQuery(formData);

    const newData = {
      image: responseFile.url,
      title: data.title,
      description: data.description,
    };

    await editTodoMutation({ _id: isEdit, newData });
    setIsEdit(null);
  };

  return (
    <div id={scss.TodoList}>
      <div className="container">
        <div className={scss.TodoList}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="file"
              {...register("image", { required: true })}
              placeholder=" Product Url..."
            />
            <input
              type="text"
              {...register("title", { required: true })}
              placeholder=" Product Name..."
            />
            <input
              type="text"
              {...register("description", { required: true })}
              placeholder=" Product Description..."
            />

            {isSubmitting ? (
              <button>Loading</button>
            ) : (
              <button type="submit">Submit</button>
            )}
          </form>
        </div>
        <div className={scss.Todos}>
          {isLoading ? (
            <h1>Loading</h1>
          ) : (
            <>
              {data?.map((el) =>
                isEdit === el._id ? (
                  <div className={scss.editTodos}>
                    <form onSubmit={handleSubmitEdit(onSubmitEdit)}>
                      <input
                        type="file"
                        {...registerEdit("image", { required: true })}
                        placeholder="  Product Url"
                      />
                      <input
                        type="text"
                        {...registerEdit("title", { required: true })}
                        placeholder="  Product Name"
                      />
                      <input
                        type="text"
                        {...registerEdit("description", { required: true })}
                        placeholder="  Product Description"
                      />
                      {isSubmittingEdit ? (
                        <button>Loading</button>
                      ) : (
                        <button type="submit">Submit</button>
                      )}
                      <button onClick={() => setIsEdit(null)}>Cancel</button>
                    </form>
                  </div>
                ) : (
                  <div className={scss.TodosList} key={el._id}>
                    <div>
                      <Image
                        width={200}
                        height={200}
                        src={el.image}
                        alt={el.title}
                      />
                      <h2>{el.title}</h2>
                      <h5>{el.description}</h5>
                      <div className={scss.buttons}>
                        <button
                          onClick={() => deleteTodoMutation(el._id)}
                          className={scss.buttonRed}
                        >
                          Delete{" "}
                        </button>
                        <button
                          onClick={() => setIsEdit(el._id)}
                          className={scss.buttonGreen}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
