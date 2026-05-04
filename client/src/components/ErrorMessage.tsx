import { X } from "lucide-react";

import type { ApiError, ConflictError, UnprocessableEntityError } from "@/types";
import { Button } from "@/components/ui/button";

type ErrorMessageProps = {
  error: ApiError | null;
  conflictError?: ConflictError;
  unprocessableError?: UnprocessableEntityError;
  onDismiss?: () => void;
};

const getErrorMessage = (error: ApiError): string => {
  switch (error.status) {
    case 400:
      return "Donnees invalides - Verifiez vos entrees";
    case 401:
      return "Session expiree - Veuillez vous reconnecter";
    case 403:
      return "Acces refuse - Permissions insuffisantes";
    case 404:
      return "Ressource introuvable";
    case 409:
      return error.message;
    case 422: {
      const unprocessableError = error as UnprocessableEntityError;
      if (unprocessableError.prerequisNonSatisfait) {
        return `Prerequis non satisfait : ${unprocessableError.prerequisNonSatisfait.detail}`;
      }
      return error.message;
    }
    case 429:
      return "Trop de requetes - Reessayez dans quelques minutes";
    case 500:
      return "Erreur serveur - Veuillez reessayer plus tard";
    default:
      return error.message;
  }
};

const ErrorMessage = ({
  error,
  conflictError,
  unprocessableError,
  onDismiss,
}: ErrorMessageProps) => {
  if (!error) return null;

  const displayError = unprocessableError ?? error;

  const renderConflictDetails = () => {
    if (error.status !== 409 || !conflictError) return null;

    return (
      <div className="mt-2 space-y-2">
        {conflictError.detail && (
          <p className="text-sm font-medium">{conflictError.detail}</p>
        )}
        {conflictError.aventuriersInvalides &&
          conflictError.aventuriersInvalides.length > 0 && (
            <ul className="list-inside list-disc space-y-1 text-sm">
              {conflictError.aventuriersInvalides.map((aventurier) => (
                <li key={aventurier.id}>
                  <span className="font-medium">{aventurier.nom}</span> -{" "}
                  {aventurier.raison}
                </li>
              ))}
            </ul>
          )}
      </div>
    );
  };

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950/50 dark:text-red-400">
      <div className="flex-1">
        <p className="text-sm">{getErrorMessage(displayError)}</p>
        {renderConflictDetails()}
      </div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onDismiss}
          className="text-red-700 hover:bg-red-100 hover:text-red-800 dark:text-red-400 dark:hover:bg-red-900/50 dark:hover:text-red-300"
        >
          <X className="size-4" />
          <span className="sr-only">Fermer</span>
        </Button>
      )}
    </div>
  );
};

export { ErrorMessage };
