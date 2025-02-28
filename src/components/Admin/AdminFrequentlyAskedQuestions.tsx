import { useForm } from "react-hook-form";
import { useApi } from "../../context/ApiProvider"
import useModal from "../../CustomHooks/useModal";
import useVerifyToken from "../../CustomHooks/useVerefyToken";
import { Faq } from "../../Interfaces/interfaces";
import ModalMesagge from "../Tools/ModalMesagge";
import { Editor } from '@tinymce/tinymce-react';
import ItemListFaq from "./ItemListFsq";
import { useState } from "react";


const AdminFrequentlyAskedQuestions = () => {

    const { dev, faq, refreshFaq } = useApi();
    const { validateToken } = useVerifyToken();
    const { modalConfig, openModal, closeModal } = useModal();
    const { register, handleSubmit, reset, setValue } = useForm<Faq>();
    const [focusedItemId, setFocusedItemtId] = useState<number | null>(null);

    const handleEditorChange = (content: string) => {
        setValue('answer', content);
    };

    const updateFaq = async (data: Faq): Promise<boolean> => {
        const isTokenValid = await validateToken();
        if (!isTokenValid) {
            return false;
        }

        const token = localStorage.getItem('user_token')

        try {
            const response = await fetch(`${dev}/index.php?action=update-frequently-asked-questions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data, token }),
            });

            if (!response.ok) throw new Error("Error al actualizar la pregunta frecuente.");

            const result = await response.json();

            if (!response.ok || !result.success) {
                openModal("Error", `Error al actualizar la información, ${result.message}`, closeModal);
                return false;
            }

            refreshFaq();
            openModal("Éxito", "Pregunta frecuente actualizada correctamente.", closeModal);

            return true;
        } catch (error) {
            console.error(error);
            openModal("Error", `Ocurrió un error al actualizar la pregunta frecuente.`, closeModal);
            return false;
        }
    };

    const addFaq = async (data: Faq) => {
        const isTokenValid = await validateToken();
        if (!isTokenValid) {
            return false;
        }

        const token = localStorage.getItem('user_token')

        try {
            const response = await fetch(`${dev}/index.php?action=add-frequently-asked-questions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data, token }),
            });
            if (!response.ok) throw new Error("Error al agregar la pregunta frecuente.");

            const result = await response.json();

            if (!response.ok || !result.success) {
                openModal("Error", `Error al actualizar la información, ${result.message}`, closeModal);
                return
            }

            refreshFaq();
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
        <div className="w-100">
            <div className="title-page">
                <h4>Preguntas frecuentes</h4>
            </div>
            <div className="accordion" id="accordionPanelsStayOpenExample">
                <div id='update-faq' className="accordion-item">
                    <div className="accordion-header">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="false" aria-controls="panelsStayOpen-collapseOne">
                            <h6>Preguntas frecuentes</h6>
                        </button>
                    </div>
                    <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse">
                        <div className="accordion-body">
                            <ul className="column-g-20">
                                {faq.map((item) => (
                                    <li key={item.id}
                                    className={`item-cont shadow-sm left-decoration-grey border-bottom border-top fsq ${focusedItemId === item.id ? 'focused' : ''}`}
                                        onFocus={() => setFocusedItemtId(item.id)}
                                        onBlur={() => setFocusedItemtId(null)}
                                        tabIndex={0}
                                    >
                                        <ItemListFaq
                                            key={item.id}
                                            faq={item}
                                            updateFaq={updateFaq}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div id="add-faq" className="accordion-item">
                    <div className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                            <h6>Agregar pregunta frecuente</h6>
                        </button>
                    </div>
                    <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse">
                        <div className="accordion-body">
                            <form onSubmit={handleSubmit(addFaq)} className="item-cont">
                                <div className="item-form description">
                                    <label htmlFor="question">Pregunta: </label>
                                    <input type="text"  {...register("question")} />
                                </div>
                                <label htmlFor="answer"> Respuesta:</label>
                                <Editor
                                    apiKey='l8lb42gic93aurxg94l1ijzbitffo8i746rsk9q9fmazi1th'
                                    onEditorChange={handleEditorChange}
                                    init={{
                                        height: 500,
                                        menubar: false,
                                        plugins: 'lists link image table code',
                                        toolbar:
                                            'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | code',
                                    }}
                                />
                                <textarea className="description-textarea" {...register("answer", { required: true })} ></textarea>
                                <div className="button-cont">
                                    <button className="general-button" type="submit">Guardar</button>
                                    <button className="no-button" type="reset" > Cancelar</button>
                                </div>
                            </form>
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
