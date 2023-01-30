import React, { useState } from "react";
import "./App.css";
import { api } from "./services/api";
import { ITransaction } from "./interfaces";
import { toast } from "react-toastify";

const App = () => {
  const [file, setFile] = useState<File>({} as File);

  const [listTransactions, setListTransactions] = useState<ITransaction[]>([]);

  const getStoreNames = (listTransactions: ITransaction[]) => {
    const storeNames: string[] = [];

    listTransactions.forEach((e) => {
      if (!storeNames.includes(e.store)) {
        storeNames.push(e.store);
      }
    });

    return storeNames;
  };

  const getTransactionsAndTotalValue = (
    listTransactions: ITransaction[],
    storeName: string
  ) => {
    const withdrawals = ["boleto", "financiamento", "aluguel"];
    let totalValue = 0;
    const filteredTransactions = listTransactions.filter(
      (e) => e.store === storeName
    );

    filteredTransactions.forEach((e) => {
      if (withdrawals.includes(e.type)) {
        totalValue -= Number(e.value);
      }
      totalValue += Number(e.value);
    });
    const data = {
      loja: storeName,
      transactions: filteredTransactions,
      totalValue: totalValue.toFixed(2),
    };
    return data;
  };

  const upload = async (
    file: File,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const loadingToast = toast.loading("Uploading");

    const fd = new FormData();

    fd.append("file", file);

    await api
      .post(`upload/`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setListTransactions(res.data);
        toast.dismiss(loadingToast);
        toast.success("Success");
      })
      .catch((errors) => console.error(errors));
  };

  return (
    <div className="App">
      <form
        onSubmit={(event) => upload(file, event)}
        encType="multipart/form-data"
      >
        <label htmlFor="files">Upload File</label>
        <input
          type="file"
          name="files"
          id="files"
          onChange={(event) =>
            event.target.files ? setFile(event.target.files[0]) : {}
          }
        />
        <button type="submit">Salvar</button>
      </form>

      <ul className="container">
        {getStoreNames(listTransactions).map((store) => (
          <li>
            <span>Loja: {store}</span>
            <span>
              Saldo Total: R$
              {getTransactionsAndTotalValue(listTransactions, store).totalValue}
            </span>
            <ul className="sub-list">
              {getTransactionsAndTotalValue(
                listTransactions,
                store
              ).transactions.map((e) => (
                <li>
                  <table>
                    <tr>
                      <td>Cartão: </td>
                      <td> {e.card}</td>
                    </tr>
                    <tr>
                      <td>Data:</td> <td>{e.date}</td>
                    </tr>
                    <tr>
                      <td>CPF:</td> <td>{e.cpf}</td>
                    </tr>
                    <tr>
                      <td>Dono:</td> <td>{e.owner}</td>
                    </tr>
                    <tr>
                      <td>Tipo:</td> <td>{e.type}</td>
                    </tr>
                    <tr>
                      <td>Valor:</td> <td>R$ {e.value} </td>
                    </tr>
                  </table>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
