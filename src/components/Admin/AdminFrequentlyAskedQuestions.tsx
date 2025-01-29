import { useForm } from "react-hook-form";
import { useApi } from "../../context/ApiProvider"
import useModal from "../../CustomHooks/modal";
import useVerifyToken from "../../CustomHooks/verefyToken";
import { Fsq } from "../../Interfaces/interfaces";
import ModalMesagge from "../Tools/ModalMesagge";
import ItemListFsq from "./ItemListFsq";
import { Editor } from '@tinymce/tinymce-react';


const AdminFrequentlyAskedQuestions = () => {

    const { dev, fsq, refreshFsq } = useApi();
    const { validateToken } = useVerifyToken();
    const { modalConfig, openModal, closeModal } = useModal();
    const { register, handleSubmit, reset, setValue } = useForm<Fsq>();

    const handleEditorChange = (content: string) => {
        setValue('answer', content);
    };

    const updateFsq = async (data: Fsq): Promise<boolean> => {
        const isTokenValid = await validateToken();
        if (!isTokenValid) {
            return false;
        }

        console.log(data)

        const token = localStorage.getItem('token')

        try {
            const response = await fetch(`${dev}/index.php?action=update-frequently-asked-questions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error("Error al actualizar la pregunta frecuente.");

            const result = await response.json();

            if (!response.ok || !result.success) {
                openModal("Error", `Error al actualizar la información", ${result.message}`, closeModal);
                return false;
            }

            refreshFsq();
            openModal("Éxito", "Pregunta frecuente actualizada correctamente.", closeModal);

            return true;
        } catch (error) {
            console.error(error);
            openModal("Error", `Ocurrió un error al actualizar la pregunta frecuente.`, closeModal);
            return false;
        }
    };

    const addFsq = async (data: Fsq) => {
        const isTokenValid = await validateToken();
        if (!isTokenValid) {
            return false;
        }

        const token = localStorage.getItem('token')

        try {
            const response = await fetch(`${dev}/index.php?action=add-frequently-asked-questions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error("Error al agregar la pregunta frecuente.");

            const result = await response.json();

            if (!response.ok || !result.success) {
                openModal("Error", `Error al actualizar la información", ${result.message}`, closeModal);
                return
            }

            refreshFsq();
            openModal("Éxito", "Información actualizada correctamente", closeModal);

            reset();
            return true;

        } catch (error) {
            console.error(error);
            openModal("Error", `Ocurrió un error al actualizar la pregunta frecuente.`, closeModal);
            return false;
        }
    };

    return (
        <div>
            <h3>Preguntas frecuentes</h3>
            <div className="accordion" id="accordionPanelsStayOpenExample">
                <div id='update-fsq' className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="false" aria-controls="panelsStayOpen-collapseOne">
                            Preguntas frecuentes
                        </button>
                    </h2>
                    <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse">
                        <div className="accordion-body">
                            <ul className="list-acordeon">
                                {fsq.map((item) => {
                                    return <ItemListFsq
                                        key={item.id}
                                        fsq={item}
                                        updateFsq={updateFsq}
                                    />
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
                <div id="add-fsq" className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                            Agregar pregunta frecuente
                        </button>
                    </h2>
                    <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse">
                        <div className="accordion-body">
                            <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse">
                                <div className="accordion-body">
                                    <form onSubmit={handleSubmit(addFsq)} className="d-flex flex-column">
                                        <span>
                                            <label htmlFor="question">Pregunta: </label>
                                            <input type="text"  {...register("question")} />
                                        </span>
                                        <span>
                                            <label htmlFor="answer"> Respuesta:</label>
                                            <Editor
                                                apiKey='l8lb42gic93aurxg94l1ijzbitffo8i746rsk9q9fmazi1th'
                                                onEditorChange={handleEditorChange}
                                                init={{
                                                    height: 300,
                                                    menubar: false,
                                                    plugins: 'lists link image table code',
                                                    toolbar:
                                                        'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | code',
                                                }}
                                            />
                                            <textarea  {...register("answer", { required: true })} ></textarea>
                                        </span>
                                        <button type="submit">Guardar</button>
                                        <button type="reset" > Cancelar</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalMesagge
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                content={<p>{modalConfig.content}</p>}
                onClose={closeModal}
                onConfirm={modalConfig.onConfirm}
                confirmText={modalConfig.confirmText}
                cancelText={modalConfig.cancelText}
            />
        </div>
    )
}

export default AdminFrequentlyAskedQuestions
